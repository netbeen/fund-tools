import { fetchDividendByIdentifier, fetchSplitByIdentifier, calcReturn, fetchUnitPriceByIdentifier } from '../src'
import {
  internalDayjs,
  sliceBetween
} from '../src/utils'
import {
  getMockOperationsOn202002,
  getMockOperationsOn512010,
  getMockOperationsOn519671One,
  getMockOperationsOn519671Two
} from '../src/testUtils'
import { HISTORY_START_DATE } from '../src/constant'

test('Real data test on 519671 until 2021-11-11 测试 买入', async () => {
  const [unitResult, dividendsResult, splitResult] = await Promise.all([
    fetchUnitPriceByIdentifier('519671'),
    fetchDividendByIdentifier('519671'),
    fetchSplitByIdentifier('519671')
  ])
  const result = calcReturn(
    sliceBetween(unitResult, HISTORY_START_DATE, internalDayjs('2021-11-11')),
    dividendsResult,
    splitResult,
    getMockOperationsOn519671One(),
  )
  expect(result.unitPrice).toBe(1.597)
  expect(result.unitCost).toBe(1.6110785712273878)
  expect(result.positionValue).toBe(21546.05326)
  expect(result.volume).toBe(13491.58)
  expect(result.positionReturn).toBe(-189.94217000000165)
  expect(result.positionRateOfReturn).toBe(-0.008738600015430793)
})

test('Real data test on 519671 until 2019-09-30 测试 买入/卖出/分红', async () => {
  const [unitResult, dividendsResult, splitResult] = await Promise.all([
    fetchUnitPriceByIdentifier('519671'),
    fetchDividendByIdentifier('519671'),
    fetchSplitByIdentifier('519671')
  ])
  const result = calcReturn(
    unitResult,
    dividendsResult,
    splitResult,
    getMockOperationsOn519671Two(),
  )
  expect(result.unitPrice).toBe(1.417)
  expect(result.volume).toBe(0)
  expect(result.totalCommission).toBe(40)
  expect(result.positionValue).toBe(0)
  expect(result.positionReturn).toBeCloseTo(0, 9)
  expect(result.exitReturn).toBe(-72.49999999999989)
  expect(result.totalReturn).toBe(-72.49999999999989)
  expect(result.positionRateOfReturn).toBeNaN()
})

test('Real data test on 512010 until 2021-11-12 测试 买入/卖出/拆分', async () => {
  const [unitResult, dividendsResult, splitResult] = await Promise.all([
    fetchUnitPriceByIdentifier('512010'),
    fetchDividendByIdentifier('512010'),
    fetchSplitByIdentifier('512010')
  ])
  const result = calcReturn(
    sliceBetween(unitResult, HISTORY_START_DATE, internalDayjs('2021-11-12')),
    dividendsResult,
    splitResult,
    getMockOperationsOn512010(),
  )
  expect(result.unitPrice).toBe(0.6416)
  expect(result.unitCost).toBe(0.8303831632653061)
  expect(result.volume).toBe(7000)
  expect(result.totalCommission).toBe(50)
  expect(result.positionReturn).toBe(-1321.4821428571433)
  expect(result.positionCost).toBe(5812.682142857143)
  expect(result.positionValue).toBe(4491.2)
  expect(result.positionRateOfReturn).toBe(-0.2273446423491492)
  expect(result.exitReturn).toBe(-8.167857142857107)
  expect(result.totalReturn).toBe(-1329.6500000000005)
})

test('Real data test on 202002 until 2021-11-12 测试 买入/卖出/分红/拆分', async () => {
  const [unitResult, dividendsResult, splitResult] = await Promise.all([
    fetchUnitPriceByIdentifier('202002'),
    fetchDividendByIdentifier('202002'),
    fetchSplitByIdentifier('202002')
  ])
  const result = calcReturn(
    sliceBetween(unitResult, HISTORY_START_DATE, internalDayjs('2021-11-12')),
    dividendsResult,
    splitResult,
    getMockOperationsOn202002(),
  )
  expect(result.unitPrice).toBe(0.615)
  expect(result.unitCost).toBe(0.7904529095375764)
  expect(result.volume).toBe(3687.9500000000003)
  expect(result.totalCommission).toBe(50)
  expect(result.positionReturn).toBe(-647.061557729105)
  expect(result.positionCost).toBe(2915.150807729105)
  expect(result.positionValue).toBe(2268.08925)
  expect(result.positionRateOfReturn).toBe(-0.22196503728503988)
  expect(result.exitReturn).toBe(2497.441502729105)
  expect(result.totalReturn).toBe(1850.3799450000001)
})

test('Test for invalid params', () => {
  expect(() => {
    calcReturn(null, [], [], [])
  }).toThrow('Params Error')
  expect(() => {
    calcReturn([], null, [], [])
  }).toThrow('Params Error')
  expect(() => {
    calcReturn([], [], null, [])
  }).toThrow('Params Error')
  expect(() => {
    calcReturn([], [], [], null)
  }).toThrow('Params Error')
})
