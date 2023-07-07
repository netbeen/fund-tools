import { calcReturn } from './return';
import {
  fetchBasicInfoByIdentifier,
  fetchUnitPriceByIdentifier,
  fetchSplitByIdentifier,
  fetchAccumulatedPriceByIdentifier,
  fetchDividendByIdentifier,
  DatePrice,
  DateDividend,
  DateSplitRatio,
  BasicInfo,
} from './crawler';
import { OPERATION_DIRECTION_BUY, OPERATION_DIRECTION_SELL } from './constants';
import { sliceBetween, lastOfArray } from './utils';

export {
  calcReturn,
  fetchUnitPriceByIdentifier,
  fetchSplitByIdentifier,
  fetchAccumulatedPriceByIdentifier,
  fetchDividendByIdentifier,
  fetchBasicInfoByIdentifier,
  sliceBetween,
  lastOfArray,
  OPERATION_DIRECTION_BUY,
  OPERATION_DIRECTION_SELL,
};

export type { DatePrice, DateDividend, DateSplitRatio, BasicInfo };
