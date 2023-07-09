import dayjs, { Dayjs } from 'dayjs';
import { irr } from 'financial';
import almostEqual from 'almost-equal';
import {
  findByDateFromArray,
  lastOfArray,
  sliceBetween,
  weightedSum,
  findClosestSmallerItemByDateFromArray,
} from './utils';
import { OPERATION_DIRECTION_BUY } from './constants';
import { DateDividend, DatePrice, DateSplitRatio } from './crawler';

export interface Operation {
  date: Dayjs;
  volume: number;
  commission: number;
  direction: 'BUY' | 'SELL';
}

/**
 * 计算当前 TransactionSet 的年化收益率
 */
const calcAnnualizedRateOfReturn = (
  lastDayOfTransactionSet: Dayjs | null,
  currentVolume: number,
  unitPrices: DatePrice[],
  operations: Operation[],
) => {
  const startDate = operations[0].date;
  const duration = (lastDayOfTransactionSet || dayjs()).diff(startDate, 'day');
  const irrData = [];
  for (let i = 0; i < duration + 1; i += 1) {
    const currentDate = startDate.add(i, 'day');
    const targetOperation = operations.find(operation =>
      operation.date.isSame(currentDate),
    );

    if (targetOperation) {
      const currentUnitPriceObject = findByDateFromArray(
        unitPrices,
        currentDate,
      );
      if (!currentUnitPriceObject) {
        throw new Error('!currentUnitPriceObject');
      }
      if (targetOperation.direction === OPERATION_DIRECTION_BUY) {
        irrData.push(
          -(targetOperation.volume * currentUnitPriceObject.price) -
            targetOperation.commission,
        );
      } else {
        irrData.push(
          targetOperation.volume * currentUnitPriceObject.price -
            targetOperation.commission,
        );
      }
    } else if (i === duration && !lastDayOfTransactionSet) {
      // 未找到交易记录的两个case: 1. 当日无交易，推0 2. 未卖出交易的最后一天，模拟卖出计算收益
      const currentUnitPriceObject = findClosestSmallerItemByDateFromArray(
        unitPrices,
        currentDate,
      );
      if (!currentUnitPriceObject) {
        throw new Error('currentUnitPriceObject 不存在');
      }
      irrData.push(currentVolume * currentUnitPriceObject.price);
    } else {
      // 未找到交易记录的两个case: 1. 当日无交易，推0 2. 未卖出交易的最后一天，模拟卖出计算收益
      irrData.push(0);
    }
  }

  // 当前年化收益率公式 = 总收益 / 总市值积分 * 365
  return irr(irrData, 0, 0.00001, 1000) * 365;
};

export interface CalcReturnData {
  /**
   * 最新单位净值
   */
  unitPrice: number;
  /**
   * 最新单位成本
   */
  unitCost: number;
  /**
   * 持仓份额
   */
  volume: number;
  /**
   * 总显性手续费
   */
  totalCommission: number;
  /**
   * 总分红
   */
  totalDividend: number;
  /**
   * 持仓总收益
   */
  positionReturn: number;
  /**
   * 持仓总成本
   */
  positionCost: number;
  /**
   * 持仓总市值
   */
  positionValue: number;
  /**
   * 持仓收益率
   */
  positionRateOfReturn: number;
  /**
   * 落袋收益
   */
  exitReturn: number;
  /**
   * 总收益 = 持仓总收益 + 落袋收益
   */
  totalReturn: number;
  /**
   * 总成本
   */
  totalCost: number;
  /**
   * 总收益率
   */
  totalRateOfReturn: number;
  /**
   * 总年化收益率 (IRR)
   */
  totalAnnualizedRateOfReturn: number;
}

/**
 * 计算收益：包括 当前净值、当前成本、收益额、收益率、年化收益率
 * 计算范围：operations 的第一天 ~ unitPrices 的最后一天
 * @param unitPrices Array<{date: Date, price: number}> 单位净值按照date升序排列
 * @param dividends Array<{date: Date, dividend: number}> 分红事件按照date升序排列
 * @param splits Array<{date: Date, splitRatio: number}> 拆分事件按照date升序排列
 * @param operations Array<{date: Date, volume: number, commission: number, direction: 'BUY'|'SELL'}> 按照date升序排列
 * @return returnObj {price: number, cost: number, return: number, rateOfReturn: number, annualizedRateOfReturn: number}
 */
export const calcReturn = (
  unitPrices: DatePrice[],
  dividends: DateDividend[],
  splits: DateSplitRatio[],
  operations: Operation[],
) => {
  if (operations.length === 0) {
    throw new Error('Param operations received []');
  }
  const validUnitPrices = sliceBetween(unitPrices, operations[0].date, dayjs());
  const validDividends = sliceBetween(
    dividends,
    operations[0].date,
    lastOfArray(validUnitPrices).date,
  );
  const validSplits = sliceBetween(
    splits,
    operations[0].date,
    lastOfArray(validUnitPrices).date,
  );

  // 统计出所有 买卖、分红、拆分 会影响成本和持仓数量的时间点，并按照递增排序
  const operationOrDividendOrSplitDate = Array.from(
    new Set([
      ...validDividends.map(item => item.date),
      ...validSplits.map(item => item.date),
      ...operations.map(item => item.date),
    ]),
  ).sort((a, b) => a.valueOf() - b.valueOf());

  // 持仓储量统计值
  let currentVolume = 0;
  // 单位成本统计值: 单位成本 = 单位净值 + 单位手续费
  let currentUnitCost = 0;
  // 总显性手续费统计值：显性手续费仅在买入卖出时扣除，每日的基金管理费、托管费属于隐性手续费，不在此统计范围
  let currentCommission = 0;
  // 总离场利润统计值
  let currentExitReturn = 0;
  // 总分红利润统计值
  let currentDividend = 0;
  // 总买入金额统计值
  let currentCost = 0;
  // 两个概念定义：Transaction = 特定的一笔交易；TransactionSet = 针对同一个投资标的，在一个投资周期内（从开仓到清仓）的所有交易的集合
  // lastDayOfTransactionSet 非 null 即表示本 TransactionSet 是已经终结的历史数据
  let lastDayOfTransactionSet = null;

  operationOrDividendOrSplitDate.forEach(eventDate => {
    // 拆分: 增加持仓数量，减少单位成本
    const splitEvent = findByDateFromArray(validSplits, eventDate);
    if (splitEvent) {
      currentVolume *= splitEvent.splitRatio;
      currentUnitCost /= splitEvent.splitRatio;
    }
    // 分红: 增加离场利润
    const dividendEvent = findByDateFromArray(validDividends, eventDate);
    if (dividendEvent) {
      currentExitReturn += dividendEvent.dividend * currentVolume;
      currentDividend += dividendEvent.dividend * currentVolume;
    }
    // 买卖: 增加总手续费
    // 买: 增加持仓数量，改变单位成本
    // 卖: 减少持仓数量，改变离场盈利
    const operationEvent = findByDateFromArray(operations, eventDate);
    if (operationEvent) {
      const unitPriceObj = findByDateFromArray(validUnitPrices, eventDate);
      if (!unitPriceObj) {
        throw new Error(
          `Try to find unitPrice on ${eventDate.format()}, but get ${unitPriceObj}`,
        );
      }
      const unitPriceThatDay = unitPriceObj.price;
      if (operationEvent.direction === OPERATION_DIRECTION_BUY) {
        // 本次买入的单位净值（包含手续费）
        const thisEventUnitCost =
          unitPriceThatDay + operationEvent.commission / operationEvent.volume;

        // 本次买入后的单位成本
        currentUnitCost = weightedSum([
          { value: currentUnitCost, weight: currentVolume },
          { value: thisEventUnitCost, weight: operationEvent.volume },
        ]);

        // 累计总成本
        currentCost +=
          unitPriceThatDay * operationEvent.volume + operationEvent.commission;
      } else {
        const thisEventReturn =
          (unitPriceThatDay - currentUnitCost) * operationEvent.volume -
          operationEvent.commission;
        currentExitReturn += thisEventReturn;
      }
      currentCommission += operationEvent.commission;
      currentVolume +=
        operationEvent.direction === OPERATION_DIRECTION_BUY
          ? operationEvent.volume
          : -operationEvent.volume;

      if (currentVolume === 0) {
        lastDayOfTransactionSet = eventDate;
      }
    }
  });

  const lastValidUnitPriceObj = lastOfArray(validUnitPrices);
  if (!lastValidUnitPriceObj) {
    throw new Error(
      `Try to get last unitPrice failed, got ${lastValidUnitPriceObj}`,
    );
  }

  // 验算
  const calcVolumeResult = calcVolume(splits, operations);
  if (calcVolumeResult !== currentVolume) {
    throw new Error(
      `currentVolume check failed. currentVolume=${currentVolume} calcVolumeResult=${calcVolumeResult}`,
    );
  }

  // 持仓盈利
  const positionReturn = lastDayOfTransactionSet
    ? 0
    : (lastValidUnitPriceObj.price - currentUnitCost) * currentVolume;
  // 持仓成本
  const positionCost = currentUnitCost * currentVolume;
  // 总盈利
  const totalReturn = positionReturn + currentExitReturn;

  const totalAnnualizedRateOfReturn = calcAnnualizedRateOfReturn(
    lastDayOfTransactionSet,
    currentVolume,
    validUnitPrices,
    operations,
  );

  return {
    unitPrice: lastDayOfTransactionSet
      ? findByDateFromArray(validUnitPrices, lastDayOfTransactionSet)?.price
      : lastValidUnitPriceObj.price,
    unitCost: currentUnitCost,
    volume: currentVolume,
    totalCommission: currentCommission,
    totalDividend: currentDividend,
    positionReturn,
    positionCost,
    positionValue: currentVolume * lastValidUnitPriceObj.price,
    positionRateOfReturn: positionReturn / positionCost,
    exitReturn: currentExitReturn,
    totalReturn,
    totalCost: currentCost,
    totalRateOfReturn: totalReturn / currentCost,
    totalAnnualizedRateOfReturn,
  } as CalcReturnData;
};

function isDateSplitRatio(
  event: Operation | DateSplitRatio,
): event is DateSplitRatio {
  return (event as DateSplitRatio).splitRatio !== undefined;
}

/**
 * 计算最新份额
 * @param splits
 * @param operations
 */
export const calcVolume = (
  splits: DateSplitRatio[],
  operations: Operation[],
) => {
  if (operations.length === 0) {
    throw new Error(
      'Param operations received [], at least one operation is required.',
    );
  }
  // 只计算从开仓日期以后的拆分动作（历史拆分不影响份额）
  const validSplits = sliceBetween(splits, operations[0].date, dayjs());

  // 持仓储量统计值
  let currentVolume = 0;
  // 单位成本统计值: 单位成本 = 单位净值 + 单位手续费

  [...validSplits, ...operations]
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    .forEach(event => {
      if (isDateSplitRatio(event)) {
        // 拆分: 增加持仓数量，减少单位成本
        currentVolume *= event.splitRatio;
      } else {
        // 买卖: 增加总手续费
        // 买: 增加持仓数量，改变单位成本
        // 卖: 减少持仓数量，改变离场盈利
        currentVolume +=
          event.direction === OPERATION_DIRECTION_BUY
            ? event.volume
            : -event.volume;
      }

      // data validation check
      if (
        currentVolume < 0 &&
        !almostEqual(
          currentVolume,
          0,
          almostEqual.FLT_EPSILON,
          almostEqual.FLT_EPSILON,
        )
      ) {
        throw new Error(
          `Error: currentVolume < 0! invalid transaction list, currentVolume=${currentVolume}, event=${JSON.stringify(
            event,
          )}`,
        );
      }
    });

  // operationOrSplitDate.forEach(eventDate => {
  //   // 拆分: 增加持仓数量，减少单位成本
  //   const splitEvent = findByDateFromArray(validSplits, eventDate);
  //   if (splitEvent) {
  //     currentVolume *= splitEvent.splitRatio;
  //   }
  //   // 买卖: 增加总手续费
  //   // 买: 增加持仓数量，改变单位成本
  //   // 卖: 减少持仓数量，改变离场盈利
  //   const operationEvent = findByDateFromArray(operations, eventDate);
  //   if (operationEvent) {
  //     currentVolume +=
  //       operationEvent.direction === OPERATION_DIRECTION_BUY
  //         ? operationEvent.volume
  //         : -operationEvent.volume;
  //     if (currentVolume < 0) {
  //       throw new Error(
  //         `Error: currentVolume < 0! invalid transaction list, currentVolume=${currentVolume}, operationEvent=${JSON.stringify(
  //           operationEvent,
  //         )}`,
  //       );
  //     }
  //   }
  // });

  return currentVolume;
};
