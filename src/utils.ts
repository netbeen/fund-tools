import dayjs, { Dayjs } from 'dayjs';

export const internalDayjs = dayjs;

export const sortByDate = <T extends { date: Dayjs }>(inputArray: T[]): T[] =>
  inputArray.sort((a, b) => a.date.valueOf() - b.date.valueOf());

export const sliceBetween = <T extends { date: Dayjs }>(
  inputArray: T[],
  startDate: Dayjs,
  endDate: Dayjs,
) => inputArray.filter(item => item.date >= startDate && item.date <= endDate);

export const lastOfArray = <T>(inputArray: T[]): T =>
  inputArray[inputArray.length - 1];

export const findByDateFromArray = <T extends { date: Dayjs }>(
  inputArray: T[],
  targetDate: Dayjs,
) => inputArray.find(item => item.date.isSame(targetDate));

export const findClosestSmallerItemByDateFromArray = <
  T extends { date: Dayjs },
>(
  inputArray: T[],
  targetDate: Dayjs,
) => inputArray.reverse().find(item => item.date <= targetDate);

export const weightedSum = (
  inputArray: { value: number; weight: number }[],
) => {
  let numerator = 0;
  let denominator = 0;
  inputArray.forEach(item => {
    numerator += item.value * item.weight;
    denominator += item.weight;
  });
  return numerator / denominator;
};
