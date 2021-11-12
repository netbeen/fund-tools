import { fetchDividendByIdentifier, fetchSplitByIdentifier, calcReturn, fetchUnitPriceByIdentifier } from '../src'
import { getMockOperationsOn519671 } from '../src/utils'

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
