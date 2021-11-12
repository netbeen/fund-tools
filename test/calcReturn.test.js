import { calcReturn } from '../src'
import { OPERATION_DIRECTION_BUY } from '../src/constant'

const mockUnitPrices = [
  { date: new Date('2020-12-31'), price: 0.5 },
  { date: new Date('2021-01-01'), price: 1 },
  { date: new Date('2021-01-02'), price: 2 },
  { date: new Date('2021-01-03'), price: 2 },
  { date: new Date('2021-01-04'), price: 3 },
  { date: new Date('2021-01-05'), price: 1 },
  { date: new Date('2021-01-06'), price: 1.1 },
  { date: new Date('2021-01-07'), price: 1.2 },
  { date: new Date('2021-01-08'), price: 1 }
]

const mockDividends = [
  { date: new Date('2021-01-04'), dividend: 0.02 }
]

const mockSplits = [
  { date: new Date('2021-01-05'), splitRatio: 4 }
]

const mockOperations = [{
  date: new Date('2021-01-01'), volume: 100, direction: OPERATION_DIRECTION_BUY
}, {
  date: new Date('2021-01-06'), volume: 100, direction: OPERATION_DIRECTION_BUY
}]

it('calcReturn Test', () => {
  const result = calcReturn(
    mockUnitPrices,
    mockDividends,
    mockSplits,
    mockOperations,
  )
  console.log('result', result)
})
