/* eslint-disable max-len */
import dayjs from 'dayjs'
import { OPERATION_DIRECTION_BUY } from './constant'

export const sortByDate = inputArray => inputArray.sort((a, b) => (b.valueOf() - a.valueOf()))

export const sliceBetween = (inputArray, startDate, endDate) => inputArray.filter(item => (
  item.date >= startDate && item.date <= endDate
))

export const lastOfArray = inputArray => (inputArray[inputArray.length - 1])

// on 519671 until 2021-11-11
export const getMockOperationsOn519671 = () => ([{
  date: dayjs('2021-06-09'), volume: 2958.54, direction: OPERATION_DIRECTION_BUY, commission: 5.99
}, {
  date: dayjs('2021-07-12'), volume: 3378.46, direction: OPERATION_DIRECTION_BUY, commission: 6.54
}, {
  date: dayjs('2021-08-09'), volume: 3957.39, direction: OPERATION_DIRECTION_BUY, commission: 7.53
}, {
  date: dayjs('2021-11-09'), volume: 3197.19, direction: OPERATION_DIRECTION_BUY, commission: 5.99
}])

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
