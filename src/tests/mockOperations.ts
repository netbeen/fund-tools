import dayjs from 'dayjs';
import {
  OPERATION_DIRECTION_BUY,
  OPERATION_DIRECTION_SELL,
} from '../constants';
import { Operation } from '@/return';

export const mockOperations1 = [
  {
    date: dayjs('2019-01-01'),
    volume: 1000,
    direction: OPERATION_DIRECTION_BUY,
    commission: 1,
  },
  {
    date: dayjs('2020-01-01'),
    volume: 1000,
    direction: OPERATION_DIRECTION_BUY,
    commission: 1,
  },
  {
    date: dayjs('2021-01-01'),
    volume: 2000,
    direction: OPERATION_DIRECTION_SELL,
    commission: 1,
  },
] as Operation[];

export const mockOperationsWithADayDoBothBuyAndSell = [
  {
    date: dayjs('2019-01-01'),
    volume: 1000,
    direction: OPERATION_DIRECTION_BUY,
    commission: 1,
  },
  {
    date: dayjs('2020-01-01'),
    volume: 1000,
    direction: OPERATION_DIRECTION_BUY,
    commission: 1,
  },
  {
    date: dayjs('2021-01-01'),
    volume: 2000,
    direction: OPERATION_DIRECTION_SELL,
    commission: 1,
  },
  {
    date: dayjs('2021-01-01'),
    volume: 300,
    direction: OPERATION_DIRECTION_BUY,
    commission: 1,
  },
  {
    date: dayjs('2021-01-02'),
    volume: 300,
    direction: OPERATION_DIRECTION_BUY,
    commission: 1,
  },
] as Operation[];
