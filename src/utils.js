/* eslint-disable max-len */
import dayjs from 'dayjs'

export const internalDayjs = dayjs

export const sortByDate = inputArray => inputArray.sort((a, b) => (b.valueOf() - a.valueOf()))

export const sliceBetween = (inputArray, startDate, endDate) => inputArray.filter(item => (
  item.date >= startDate && item.date <= endDate
))

export const lastOfArray = inputArray => (inputArray[inputArray.length - 1])

export const findByDateFromArray = (inputArray, targetDate) => (inputArray.find(item => item.date.isSame(targetDate)))

export const
  findClosestSmallerItemByDateFromArray = (inputArray, targetDate) => (
    inputArray.reverse().find(item => item.date <= targetDate)
  )

export const weightedSum = (inputArray) => {
  let numerator = 0
  let denominator = 0
  inputArray.forEach((item) => {
    numerator += item.value * item.weight
    denominator += item.weight
  })
  return numerator / denominator
}
