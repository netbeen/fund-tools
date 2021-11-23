/* eslint-disable max-len */
import dayjs from 'dayjs'
import {
  findByDateFromArray,
  findClosestSmallerItemByDateFromArray,
  lastOfArray,
  sliceBetween,
  weightedSum
} from './utils'
import { OPERATION_DIRECTION_BUY } from './constant'

/**
 * 计算当前 TransactionSet 的年化收益率
 */
const calcAnnualizedRateOfReturn = (endDate, unitPrices, operations, totalReturn) => {
  const startDate = operations[0].date
  // console.log(startDate.format(), endDate.format(), unitPrices.length, operations.length, totalReturn)

  const dateDiff = endDate.diff(startDate, 'day')
  const volumeLog = []

  // 「将手续费和市值按天离散后，取积分」的统计值
  let integrationOfCommission = 0
  let integrationOfPositionValue = 0
  operations.forEach((operation) => {
    integrationOfCommission += endDate.diff(operation.date, 'day') * operation.commission
    if (volumeLog.length === 0) {
      volumeLog.push({ date: operation.date, volume: operation.volume })
    } else {
      volumeLog.push({
        date: operation.date,
        volume: lastOfArray(volumeLog).volume + (operation.direction === OPERATION_DIRECTION_BUY
          ? operation.volume
          : -operation.volume
        )
      })
    }
  })
  for (let i = 0; i < dateDiff; i += 1) {
    const dateIndex = startDate.add(i, 'day')
    const positionValue =
        findClosestSmallerItemByDateFromArray(unitPrices, dateIndex).price *
        findClosestSmallerItemByDateFromArray(volumeLog, dateIndex).volume
    integrationOfPositionValue += positionValue
  }

  // console.log(integrationOfCommission, integrationOfPositionValue)
  return (totalReturn / (integrationOfCommission + integrationOfPositionValue)) * 365
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
  const validDividends = sliceBetween(dividends, operations[0].date, dayjs())
  const validSplits = sliceBetween(splits, operations[0].date, dayjs())

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
      const unitPriceThatDay = findByDateFromArray(validUnitPrices, eventDate).price
      if (operationEvent.direction === OPERATION_DIRECTION_BUY) {
        const thisEventUnitCost = unitPriceThatDay + (operationEvent.commission / operationEvent.volume)
        currentUnitCost = weightedSum([{ value: currentUnitCost, weight: currentVolume }, { value: thisEventUnitCost, weight: operationEvent.volume }])
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

  // 持仓盈利
  const positionReturn = lastDayOfTransactionSet
    ? 0
    : (lastOfArray(validUnitPrices).price - currentUnitCost) * currentVolume
  // 持仓成本
  const positionCost = currentUnitCost * currentVolume
  // 总盈利
  const totalReturn = positionReturn + currentExitReturn

  const totalAnnualizedRateOfReturn = calcAnnualizedRateOfReturn(
    lastDayOfTransactionSet || dayjs(),
    unitPrices,
    operations,
    totalReturn
  )

  return {
    unitPrice: lastDayOfTransactionSet
      ? findByDateFromArray(validUnitPrices, lastDayOfTransactionSet).price
      : lastOfArray(validUnitPrices).price,
    unitCost: currentUnitCost,
    volume: currentVolume,
    totalCommission: currentCommission,
    totalDividend: currentDividend,
    positionReturn,
    positionCost,
    positionValue: currentVolume * lastOfArray(validUnitPrices).price,
    positionRateOfReturn: positionReturn / positionCost,
    exitReturn: currentExitReturn,
    totalReturn,
    totalAnnualizedRateOfReturn
  }
}

export const useless = 1
