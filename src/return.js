/* eslint-disable max-len */
import dayjs from 'dayjs'
import { findByDateFromArray, lastOfArray, sliceBetween, weightedSum } from './utils'
import { OPERATION_DIRECTION_BUY } from './constant'

/**
 * 计算收益：包括 当前净值、当前成本、收益额、收益率、年化收益率
 * 计算范围：operations 的第一天 ~ unitPrices 的最后一天
 * @param unitPrices Array<{date: Date, price: number}> 单位净值按照date升序排列
 * @param operations Array<{date: Date, volume: number, commission: number, direction: 'BUY'|'SELL'}> 按照date升序排列
 * @return returnObj {price: number, cost: number, return: number, rateOfReturn: number, annualizedRateOfReturn: number}
 */
export const calcReturn = (unitPrices, dividends, splits, operations) => {
  if (!Array.isArray(unitPrices) || !Array.isArray(operations) || !Array.isArray(dividends) || !Array.isArray(splits)) {
    throw new Error('Params Error')
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
  // 总显性手续费统计值
  let currentCommission = 0
  // 总离场利润统计值
  let currentExitReturn = 0
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
    }
  })

  const latestUnitPrice = currentVolume === 0 ? findByDateFromArray(validUnitPrices, lastOfArray(operations).date).price : lastOfArray(validUnitPrices).price
  // 持仓盈利
  const positionReturn = (latestUnitPrice - currentUnitCost) * currentVolume
  // 持仓成本
  const positionCost = currentUnitCost * currentVolume
  return {
    unitPrice: latestUnitPrice,
    unitCost: currentUnitCost,
    volume: currentVolume,
    totalCommission: currentCommission,
    positionReturn,
    positionCost,
    positionValue: currentVolume * lastOfArray(validUnitPrices).price,
    positionRateOfReturn: positionReturn / positionCost,
    exitReturn: currentExitReturn,
    totalReturn: positionReturn + currentExitReturn,
    totalAnnualizedRateOfReturn: 0.0000001
  }
}

export const useless = 1
