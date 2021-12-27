import { calcReturn } from '../src'
import {
  getMockOperationsOnAnnualizedRateOfReturnOne,
  getMockUnitPriceOnAnnualizedRateOfReturnOne
} from '../src/testUtils'

test('Mock Data 测试 买入/年化收益率', async () => {
  const result = calcReturn(
    getMockUnitPriceOnAnnualizedRateOfReturnOne(),
    [],
    [],
    getMockOperationsOnAnnualizedRateOfReturnOne()
  )
  expect(result.unitPrice).toBe(1.1)
  expect(result.unitCost).toBe(1.026)
  expect(result.volume).toBe(0)
  expect(result.totalCommission).toBe(3)
  expect(result.positionReturn).toBe(0)
  expect(result.positionCost).toBe(0)
  expect(result.positionValue).toBe(0)
  expect(result.positionRateOfReturn).toBeNaN()
  expect(result.exitReturn).toBe(147.00000000000014)
  expect(result.totalReturn).toBe(147.00000000000014)
  expect(result.totalCost).toBe(2052)
  expect(result.totalRateOfReturn).toBe(0.07163742690058486)
  // expect(result.totalAnnualizedRateOfReturn).toBe(0.057483578798732005)
  expect(result.totalAnnualizedRateOfReturn).toBe(0.046234386144782175)
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
  expect(() => {
    calcReturn([], [], [], [])
  }).toThrow('Param operations received []')
})
