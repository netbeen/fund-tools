import { calcReturn } from '../src'
import { OPERATION_DIRECTION_BUY, OPERATION_DIRECTION_SELL } from '../src/constant'

const mockMarketPrice = [
  { date: new Date('2021-01-01'), price: 1 },
  { date: new Date('2021-01-02'), price: 2 },
  { date: new Date('2021-01-03'), price: 2 },
  { date: new Date('2021-01-04'), price: 3 },
  { date: new Date('2021-01-05'), price: 4 },
  { date: new Date('2021-01-06'), price: 5 },
  { date: new Date('2021-01-07'), price: 1 },
  { date: new Date('2021-01-08'), price: 1 }
]

it('calcReturn Test', () => {
  const result = calcReturn(
    mockMarketPrice,
    [{
      date: new Date('2021-01-01'), price: 1, volume: 100, direction: OPERATION_DIRECTION_BUY
    }, {
      date: new Date('2021-01-06'), price: 5, volume: 100, direction: OPERATION_DIRECTION_SELL
    }]
  )
  console.log('result', result)
})
