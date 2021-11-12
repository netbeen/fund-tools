/* eslint-disable max-len */

// 投资收益=持仓市值-买入金额+现金分红+卖出金额
// 持仓市值=持仓份额*单位净值
// 净申购金额=申购金额/（1+申购费率）
// 申购份额=净申购金额/单位净值

import { findByDateFromArray, lastOfArray, sliceBetween } from './utils'
import { OPERATION_DIRECTION_BUY } from './constant'

/**
 * 计算收益：包括 当前净值、当前成本、收益额、收益率、年化收益率
 * 计算范围：operations 的第一天 ~ unitPrices 的最后一天
 * @param unitPrices Array<{date: Date, price: number}> 单位净值按照date升序排列
 * @param operations Array<{date: Date, volume: number, commission: number, direction: 'BUY'|'SELL'}> 按照date升序排列
 * @return returnObj {price: number, cost: number, return: number, rateOfReturn: number, annualizedRateOfReturn: number}
 */
export const calcReturn = (unitPrices, dividends, splits, operations) => {
  if (!Array.isArray(unitPrices) || !Array.isArray(operations)) {
    throw new Error('Params Error')
  }
  const validUnitPrices = sliceBetween(unitPrices, operations[0].date, new Date())
  console.log('validUnitPrices', validUnitPrices)
  const validDividends = sliceBetween(dividends, operations[0].date, new Date())
  const validSplits = sliceBetween(splits, operations[0].date, new Date())
  console.log('validSplits', validSplits)

  // 统计出所有 买卖、分红、拆分 会影响成本和持仓数量的时间点，并按照递增排序
  const operationOrDividendOrSplitDate = Array.from(new Set([
    ...(validDividends.map(item => item.date)),
    ...(validSplits.map(item => item.date)),
    ...(operations.map(item => item.date))
  ])).sort((a, b) => (a - b)).map(item => new Date(item))
  console.log('operationOrDividendOrSplitDate', operationOrDividendOrSplitDate)

  // 统计 持有数量
  let currentVolume = operations[0].volume
  operationOrDividendOrSplitDate.forEach((eventDate, index) => {
    if (index === 0) {
      return
    }
    // 处理 拆分
    const splitEvent = findByDateFromArray(validSplits, eventDate)
    if (splitEvent) {
      currentVolume *= splitEvent.splitRatio
    }
    // 处理 分红
    // 处理 买卖
    const operationEvent = findByDateFromArray(operations, eventDate)
    if (operationEvent) {
      currentVolume += (operationEvent.direction === OPERATION_DIRECTION_BUY ? operationEvent.volume : -operationEvent.volume)
    }
  })

  return {
    unitPrice: lastOfArray(validUnitPrices).price,
    cost: 1,
    volume: currentVolume,
    commission: 0,
    return: 111,
    rateOfReturn: 0.32,
    annualizedRateOfReturn: 0.11
  }
}

export const useless = 1
