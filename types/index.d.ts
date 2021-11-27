import * as dayjs from 'dayjs'
export function calcReturn(
    unitPrices: Array<{date: dayjs.Dayjs, price: number}>,      // 同单位净值的接口返回格式
    dividends: Array<{date: dayjs.Dayjs, dividend: number}>,    // 同基金分红的接口返回格式
    splits: Array<{date: dayjs.Dayjs, splitRatio: number}>,     // 同基金拆分的接口返回格式
    operations: Array<{             // 交易记录
        date: dayjs.Dayjs,          // 交易日时间戳
        volume: number,             // 成交量
        commission: number,         // 手续费/佣金
        direction: 'BUY'|'SELL'     // 方向：买入/卖出
    }>
): {
    unitPrice: number,              // 单位净值
    unitCost: number,               // 单位成本
    volume: number,                 // 持仓数量
    totalCommission: number,        // 总显性手续费（仅计算申购费和赎回费，不计算银行托管费、基金管理费）
    totalDividend: number,          // 总分红
    positionReturn: number,         // 持仓收益
    positionCost: number,           // 持仓成本
    positionValue: number,          // 总市值
    positionRateOfReturn: number,   // 持仓收益率
    exitReturn: number,             // 已落袋收益
    totalReturn: number,            // 总收益
    totalAnnualizedRateOfReturn: number     // 年化收益率
};
export function fetchUnitPriceByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, price: number}>>;
export function fetchAccumulatedPriceByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, price: number}>>;
export function fetchSplitByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, splitRatio: number}>>;
export function fetchDividendByIdentifier(identifier: string): Promise<Array<{date: dayjs.Dayjs, dividend: number}>>;
export function fetchBasicInfoByIdentifier(identifier: string): Promise<{identifier: string, name: string, type: string}>;
// @ts-ignore
export function sliceBetween(inputArray: any[], startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): any[];
export function lastOfArray(inputArray: any[]): any;
