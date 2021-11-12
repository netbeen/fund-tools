import { fetchDividendByIdentifier, fetchSplitByIdentifier, calcReturn, fetchUnitPriceByIdentifier } from '../src'
import { getMockOperationsOn519671 } from '../src/utils'

// const dayjs = require('dayjs')

// const mockUnitPrices = [
//   { date: dayjs('2020-12-31'), price: 0.5 },
//   { date: dayjs('2021-01-01'), price: 1 },
//   { date: dayjs('2021-01-02'), price: 2 },
//   { date: dayjs('2021-01-03'), price: 2 },
//   { date: dayjs('2021-01-04'), price: 3 },
//   { date: dayjs('2021-01-05'), price: 1 },
//   { date: dayjs('2021-01-06'), price: 1.1 },
//   { date: dayjs('2021-01-07'), price: 1.2 },
//   { date: dayjs('2021-01-08'), price: 1.3 }
// ]
//
// const mockDividends = [
//   { date: dayjs('2021-01-04'), dividend: 0.02 }
// ]
//
// const mockSplits = [
//   { date: dayjs('2021-01-05'), splitRatio: 4 }
// ]
//
// const mockOperations = [{
//   date: dayjs('2021-01-01'), volume: 100, direction: OPERATION_DIRECTION_BUY, commission: 0.1
// }, {
//   date: dayjs('2021-01-06'), volume: 100, direction: OPERATION_DIRECTION_BUY, commission: 0.1
// }, {
//   date: dayjs('2021-01-08'), volume: 300, direction: OPERATION_DIRECTION_SELL, commission: 0.1
// }]

// it('Mock data test', () => {
//   const result = calcReturn(
//     mockUnitPrices,
//     mockDividends,
//     mockSplits,
//     mockOperations,
//   )
//   console.log('result', result)
// })

test('Real data test on 519671 until 2021-11-11', async () => {
  // 本用例涵盖行为：买入
  const [unitResult, dividendsResult, splitResult] = await Promise.all([
    fetchUnitPriceByIdentifier('519671'),
    fetchDividendByIdentifier('519671'),
    fetchSplitByIdentifier('519671')
  ])
  const result = calcReturn(
    unitResult,
    dividendsResult,
    splitResult,
    getMockOperationsOn519671(),
  )
  expect(result.unitPrice).toBe(1.597)
  expect(result.unitCost).toBe(1.6110785712273878)
  expect(result.positionValue).toBe(21546.05326)
  expect(result.volume).toBe(13491.58)
  expect(result.positionReturn).toBe(-189.94217000000165)
  expect(result.positionRateOfReturn).toBe(-0.008738600015430793)
})
