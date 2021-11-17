import '@babel/polyfill'
import { calcReturn } from './return'
import {
  fetchBasicInfoByIdentifier,
  fetchUnitPriceByIdentifier,
  fetchSplitByIdentifier,
  fetchAccumulatedPriceByIdentifier,
  fetchDividendByIdentifier
} from './crawler'
import { OPERATION_DIRECTION_BUY, OPERATION_DIRECTION_SELL } from './constant'

export {
  calcReturn,
  fetchUnitPriceByIdentifier,
  fetchSplitByIdentifier,
  fetchAccumulatedPriceByIdentifier,
  fetchDividendByIdentifier,
  fetchBasicInfoByIdentifier,
  OPERATION_DIRECTION_BUY,
  OPERATION_DIRECTION_SELL
}
