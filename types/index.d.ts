import * as dayjs from 'dayjs'
export function calcReturn(identifier: string): Promise<{date: dayjs.Dayjs, price: number}>;
export function fetchUnitPriceByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, price: number}>>;
export function fetchAccumulatedPriceByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, price: number}>>;
export function fetchSplitByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, splitRatio: number}>>;
export function fetchDividendByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, dividend: number}>>;
export function fetchBasicInfoByIdentifier(identifier: string): Promise<Array<{identifier: string, name: string, type: string}>>;
