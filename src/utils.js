/* eslint-disable max-len */
import dayjs from 'dayjs'
import { OPERATION_DIRECTION_BUY, OPERATION_DIRECTION_SELL } from './constant'

export const internalDayjs = dayjs

export const sortByDate = inputArray => inputArray.sort((a, b) => (b.valueOf() - a.valueOf()))

export const sliceBetween = (inputArray, startDate, endDate) => inputArray.filter(item => (
  item.date >= startDate && item.date <= endDate
))

export const lastOfArray = inputArray => (inputArray[inputArray.length - 1])

// on 519671 until 2021-11-11
export const getMockOperationsOn519671One = () => ([{
  date: dayjs('2021-06-09'), volume: 2958.54, direction: OPERATION_DIRECTION_BUY, commission: 5.99
}, {
  date: dayjs('2021-07-12'), volume: 3378.46, direction: OPERATION_DIRECTION_BUY, commission: 6.54
}, {
  date: dayjs('2021-08-09'), volume: 3957.39, direction: OPERATION_DIRECTION_BUY, commission: 7.53
}, {
  date: dayjs('2021-11-09'), volume: 3197.19, direction: OPERATION_DIRECTION_BUY, commission: 5.99
}])

// on 519671 until 2019-09-30
export const getMockOperationsOn519671Two = () => ([{
  date: dayjs('2019-09-02'), volume: 1000, direction: OPERATION_DIRECTION_BUY, commission: 10
}, {
  date: dayjs('2019-09-04'), volume: 500, direction: OPERATION_DIRECTION_SELL, commission: 10
}, {
  date: dayjs('2019-09-09'), volume: 1000, direction: OPERATION_DIRECTION_BUY, commission: 10
}, {
  date: dayjs('2019-09-30'), volume: 1500, direction: OPERATION_DIRECTION_SELL, commission: 10
}])

// on 512010 until 2021-11-12
export const getMockOperationsOn512010 = () => ([
  {
    date: dayjs('2021-06-01'), volume: 1000, direction: OPERATION_DIRECTION_BUY, commission: 10
  },
  {
    date: dayjs('2021-06-18'), volume: 500, direction: OPERATION_DIRECTION_BUY, commission: 10
  },
  {
    date: dayjs('2021-06-28'), volume: 1000, direction: OPERATION_DIRECTION_BUY, commission: 10
  },
  {
    date: dayjs('2021-06-29'), volume: 1500, direction: OPERATION_DIRECTION_SELL, commission: 10
  },
  {
    date: dayjs('2021-06-30'), volume: 1500, direction: OPERATION_DIRECTION_BUY, commission: 10
  }
])

export const findByDateFromArray = (inputArray, targetDate) => (inputArray.find(item => item.date.isSame(targetDate)))

export const weightedSum = (inputArray) => {
  let numerator = 0
  let denominator = 0
  inputArray.forEach((item) => {
    numerator += item.value * item.weight
    denominator += item.weight
  })
  return numerator / denominator
}
