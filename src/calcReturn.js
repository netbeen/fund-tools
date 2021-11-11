/* eslint-disable max-len */

// 投资收益=持仓市值-买入金额+现金分红+卖出金额
// 持仓市值=持仓份额*单位净值
// 净申购金额=申购金额/（1+申购费率）
// 申购份额=净申购金额/单位净值

/**
 * 计算收益：包括 当前净值、当前成本、收益额、收益率、年化收益率
 * 计算范围：operations 的第一天 ~ marketPrices 的最后一天
 * @param marketPrices Array<{date: Date, price: number}> 按照date升序排列
 * @param operations Array<{date: Date, price: number, volume: number, direction: 'BUY'|'SELL'}> 按照date升序排列
 * @return returnObj {price: number, cost: number, return: number, rateOfReturn: number, annualizedRateOfReturn: number}
 */
export const calcReturn = () => {
  console.log('123')
  return {
    price: 0,
    cost: 1,
    return: 111,
    rateOfReturn: 0.32,
    annualizedRateOfReturn: 0.11
  }
}

export const useless = 1
