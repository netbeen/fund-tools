/* eslint-disable max-len */
/**
 * 计算收益：包括 当前净值、当前成本、收益额、收益率、年化收益率
 * @param marketPrices Array<{date: Date, price: number}> 按照date升序排列
 * @param operations Array<{date: Date, price: number, volume: number, direction: 'buy'|'sell'}> 按照date升序排列
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
