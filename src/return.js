/* eslint-disable max-len */
import dayjs from 'dayjs'
import { irr } from 'financial'
import {
  findByDateFromArray,
  lastOfArray,
  sliceBetween,
  weightedSum,
  findClosestSmallerItemByDateFromArray
} from './utils'
import { OPERATION_DIRECTION_BUY } from './constant'

/**
 * 计算当前 TransactionSet 的年化收益率
 */
const calcAnnualizedRateOfReturn = (lastDayOfTransactionSet, currentVolume, unitPrices, operations) => {
  const startDate = operations[0].date
  const duration = (lastDayOfTransactionSet || dayjs()).diff(startDate, 'day')
  const irrData = []
  for (let i = 0; i < (duration + 1); i += 1) {
    const currentDate = startDate.add(i, 'day')
    const targetOperation = operations.find(operation => operation.date.isSame(currentDate))

    if (targetOperation) {
      const currentUnitPriceObject = findByDateFromArray(unitPrices, currentDate)
      if (!currentUnitPriceObject) {
        throw new Error('!currentUnitPriceObject')
      }
      if (targetOperation.direction === OPERATION_DIRECTION_BUY) {
        irrData.push(-(targetOperation.volume * currentUnitPriceObject.price) - targetOperation.commission)
      } else {
        irrData.push((targetOperation.volume * currentUnitPriceObject.price) - targetOperation.commission)
      }
    } else if (i === duration && !lastDayOfTransactionSet) {
      // 未找到交易记录的两个case: 1. 当日无交易，推0 2. 未卖出交易的最后一天，模拟卖出计算收益
      const currentUnitPriceObject = findClosestSmallerItemByDateFromArray(unitPrices, currentDate)
      irrData.push(currentVolume * currentUnitPriceObject.price)
    } else {
      // 未找到交易记录的两个case: 1. 当日无交易，推0 2. 未卖出交易的最后一天，模拟卖出计算收益
      irrData.push(0)
    }
  }

  // 当前年化收益率公式 = 总收益 / 总市值积分 * 365
  return irr(irrData, 0, 0.00001, 1000) * 365
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
export const calcReturn = (unitPrices, dividends, splits, operations) => {
  if (!Array.isArray(unitPrices) || !Array.isArray(operations) || !Array.isArray(dividends) || !Array.isArray(splits)) {
    throw new Error('Params Error')
  }
  if (operations.length === 0) {
    throw new Error('Param operations received []')
  }
  const validUnitPrices = sliceBetween(unitPrices, operations[0].date, dayjs())
  const validDividends = sliceBetween(dividends, operations[0].date, lastOfArray(validUnitPrices).date)
  const validSplits = sliceBetween(splits, operations[0].date, lastOfArray(validUnitPrices).date)

  // 统计出所有 买卖、分红、拆分 会影响成本和持仓数量的时间点，并按照递增排序
  const operationOrDividendOrSplitDate = Array.from(new Set([
    ...(validDividends.map(item => item.date)),
    ...(validSplits.map(item => item.date)),
    ...(operations.map(item => item.date))
  ])).sort((a, b) => (a - b)).map(item => dayjs(item))

  // 持仓储量统计值
  let currentVolume = 0
  // 单位成本统计值: 单位成本 = 单位净值 + 单位手续费
  let currentUnitCost = 0
  // 总显性手续费统计值：显性手续费仅在买入卖出时扣除，每日的基金管理费、托管费属于隐性手续费，不在此统计范围
  let currentCommission = 0
  // 总离场利润统计值
  let currentExitReturn = 0
  // 总分红利润统计值
  let currentDividend = 0
  // 总买入金额统计值
  let currentCost = 0
  // 两个概念定义：Transaction = 特定的一笔交易；TransactionSet = 针对同一个投资标的，在一个投资周期内（从开仓到清仓）的所有交易的集合
  // lastDayOfTransactionSet 非 null 即表示本 TransactionSet 是已经终结的历史数据
  let lastDayOfTransactionSet = null

  operationOrDividendOrSplitDate.forEach((eventDate) => {
    // 拆分: 增加持仓数量，减少单位成本
    const splitEvent = findByDateFromArray(validSplits, eventDate)
    if (splitEvent) {
      currentVolume *= splitEvent.splitRatio
      currentUnitCost /= splitEvent.splitRatio
    }
    // 分红: 增加离场利润
    const dividendEvent = findByDateFromArray(validDividends, eventDate)
    if (dividendEvent) {
      currentExitReturn += dividendEvent.dividend * currentVolume
      currentDividend += dividendEvent.dividend * currentVolume
    }
    // 买卖: 增加总手续费
    // 买: 增加持仓数量，改变单位成本
    // 卖: 减少持仓数量，改变离场盈利
    const operationEvent = findByDateFromArray(operations, eventDate)
    if (operationEvent) {
      const unitPriceObj = findByDateFromArray(validUnitPrices, eventDate)
      if (!unitPriceObj) {
        throw new Error(`Try to find unitPrice on ${eventDate.format()}, but get ${unitPriceObj}`)
      }
      const unitPriceThatDay = unitPriceObj.price
      if (operationEvent.direction === OPERATION_DIRECTION_BUY) {
        const thisEventUnitCost = unitPriceThatDay + (operationEvent.commission / operationEvent.volume)
        currentUnitCost = weightedSum([{ value: currentUnitCost, weight: currentVolume }, { value: thisEventUnitCost, weight: operationEvent.volume }])
        currentCost += (unitPriceThatDay * operationEvent.volume) + operationEvent.commission
      } else {
        const thisEventReturn = ((unitPriceThatDay - currentUnitCost) * operationEvent.volume) - operationEvent.commission
        currentExitReturn += thisEventReturn
      }
      currentCommission += operationEvent.commission
      currentVolume += (operationEvent.direction === OPERATION_DIRECTION_BUY ? operationEvent.volume : -operationEvent.volume)

      if (currentVolume === 0) {
        lastDayOfTransactionSet = eventDate
      }
    }
  })

  const lastValidUnitPriceObj = lastOfArray(validUnitPrices)
  if (!lastValidUnitPriceObj) {
    throw new Error(`Try to get last unitPrice failed, got ${lastValidUnitPriceObj}`)
  }
  // 持仓盈利
  const positionReturn = lastDayOfTransactionSet
    ? 0
    : (lastValidUnitPriceObj.price - currentUnitCost) * currentVolume
  // 持仓成本
  const positionCost = currentUnitCost * currentVolume
  // 总盈利
  const totalReturn = positionReturn + currentExitReturn

  const totalAnnualizedRateOfReturn = calcAnnualizedRateOfReturn(
    lastDayOfTransactionSet,
    currentVolume,
    validUnitPrices,
    operations,
  )

  return {
    unitPrice: lastDayOfTransactionSet
      ? findByDateFromArray(validUnitPrices, lastDayOfTransactionSet).price
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
    totalAnnualizedRateOfReturn
  }
}

export const useless = 1
