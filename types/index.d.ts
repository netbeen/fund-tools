import * as dayjs from 'dayjs'
export function calcReturn(identifier: string): Promise<{date: dayjs.Dayjs, price: number}>;
export function fetchUnitPriceByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, price: number}>>;
export function fetchSplitByIdentifier(arr: any[]): void;
export function fetchAccumulatedPriceByIdentifier(arr: any[]): void;
export function fetchDividendByIdentifier(arr: any[]): void;
