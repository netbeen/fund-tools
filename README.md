## Fund Tools

<div>
    <a href="https://unpkg.com/fund-tools/dayjs.min.js"><img src="https://img.badgesize.io/https:/unpkg.com/fund-tools/dayjs.min.js?style=flat-square&compression=gzip" alt="Gzip Size"></a>
    <a href="https://www.npmjs.com/package/fund-tools"><img src="https://img.shields.io/npm/v/fund-tools.svg?style=flat-square&colorB=51C838" alt="NPM Version"></a>
    <a href="https://travis-ci.com/iamkun/dayjs"><img src="https://img.shields.io/travis/iamkun/dayjs/master.svg?style=flat-square" alt="Build Status"></a>
    <a href="https://codecov.io/gh/netbeen/fund-tools"><img
            src="https://img.shields.io/codecov/c/github/netbeen/fund-tools/master.svg?style=flat-square" alt="Codecov"></a>
    <a href="https://github.com/netbeen/fund-tools/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="License"></a>
    <br>
</div>

> 很多人都会把基金作为一个投资方式或者家庭资产配置的重要品种，却很少有人可以回答得清楚如下的问题：你买的基金收益率如何？年化收益率如何？投资过程中获取的分红有多少？付出的手续费有多少？有没有收益表现更好的同类型基金？
> 
> 如果无法准确回答出上述问题，基金投资无异于盲人走夜路。

如果你有上述困惑，那就来对地方了，这个库可以完美回答上述问题，帮助你在投资过程中更加客观地评估自身能力，也是基金量化投资系统的核心度量组件。

## Getting Started

### Package

NPM: [https://www.npmjs.com/package/fund-tools](https://www.npmjs.com/package/fund-tools)

### Installation

```shell
npm install fund-tools --save
# OR
yarn add fund-tools
```

### Example

```javascript
import {
    fetchUnitPriceByIdentifier,
    fetchSplitByIdentifier,
    fetchDividendByIdentifier,
    calcReturn,
    OPERATION_DIRECTION_BUY,
    OPERATION_DIRECTION_SELL
} from 'fund-tools';
import * as dayjs from 'dayjs';

// 以 160119 中证500为例
const fundIdentifier = '160119'

// 通过爬虫抓取基金历史数据，包括单位净值、分红、拆分
const unitPrices = await fetchUnitPriceByIdentifier(fundIdentifier);
const dividends = await fetchDividendByIdentifier(fundIdentifier);
const splits = await fetchSplitByIdentifier(fundIdentifier);

// 录入自己的历史交易
const operations = [{
    date: dayjs('2021-06-09'), volume: 2958.54, direction: OPERATION_DIRECTION_BUY, commission: 5.99
}, {
    date: dayjs('2021-07-12'), volume: 3378.46, direction: OPERATION_DIRECTION_BUY, commission: 6.54
}, {
    date: dayjs('2021-08-09'), volume: 3957.39, direction: OPERATION_DIRECTION_BUY, commission: 7.53
}, {
    date: dayjs('2021-11-09'), volume: 3197.19, direction: OPERATION_DIRECTION_SELL, commission: 5.99
}];

const calcResult = calcReturn(unitPrices, dividends, splits, operations);
console.log(calcResult);
/**
 {
      unitPrice: 1.597, // 当前单位净值
      unitCost: 1.6110785712273878, // 当前单位净值
      volume: 13491.58, // 持仓数量
      totalCommission: 26.050000000000004, // 总显性手续费
      totalDividend: 0, // 总分红
      positionReturn: -189.94217000000165,  // 持仓收益
      positionCost: 21735.995430000003, // 持仓总成本
      positionValue: 21546.05326,   // 总市值
      positionRateOfReturn: -0.008738600015430793,  // 持仓收益率
      exitReturn: 0,    // 落袋收益
      totalReturn: -189.94217000000165, // 总收益
      totalAnnualizedRateOfReturn: -0.054593138863008296    // 总年化收益率
  }
 */
```

### API Reference 

#### fetchBasicInfoByIdentifier

拉取特定基金的基本信息

```javascript
function fetchBasicInfoByIdentifier(
    identifier: string  // 六位数字格式的基金代码
): Promise<{
    identifier: string, // 基金代码回显
    name: string,       // 基金名称
    type: string        // 基金类型: 股票型、债券型、商品型、货币型、混合型
}>;
```

#### fetchUnitPriceByIdentifier

拉取特定基金的全部交易日的单位净值数据

```javascript
function fetchUnitPriceByIdentifier(
    identifier: string  // 六位数字格式的基金代码
): Promise<Array<{
    date: dayjs.Dayjs,  // 交易日时间戳
    price: number       // 单位净值 单位:人民币
}>>;
```

#### fetchAccumulatedPriceByIdentifier

拉取特定基金的全部交易日的累计净值数据

```javascript
function fetchAccumulatedPriceByIdentifier(
    identifier: string  // 六位数字格式的基金代码
): Promise<Array<{
    date: dayjs.Dayjs,  // 交易日时间戳
    price: number       // 累计净值 单位:人民币
}>>;
```

#### fetchSplitByIdentifier

拉取特定基金的全部交易日的基金拆分数据

```javascript
function fetchAccumulatedPriceByIdentifier(
    identifier: string  // 六位数字格式的基金代码
): Promise<Array<{
    date: dayjs.Dayjs,  // 交易日时间戳
    splitRatio: number  // 拆分比例，如果是 1 拆 2.4，那么这个值就是 2.4
}>>;
```

#### fetchSplitByIdentifier

拉取特定基金的全部交易日的基金分红数据

```javascript
function fetchDividendByIdentifier(
    identifier: string  // 六位数字格式的基金代码
): Promise<Array<{
    date: dayjs.Dayjs,  // 交易日时间戳
    dividend: number    // 每份基金分红，如果是每份分红 0.024 元，那么这个值就是 0.024 单位:人民币
}>>;
```

#### calcReturn

计算投资回报率

```javascript
function calcReturn(
    unitPrices: Array<{date: dayjs.Dayjs, price: number}>,      // 同单位净值的接口返回格式
    dividends: Array<{date: dayjs.Dayjs, dividend: number}>,    // 同基金分红的接口返回格式
    splits: Array<{date: dayjs.Dayjs, splitRatio: number}>,     // 同基金拆分的接口返回格式
    operations: Array<{             // 交易记录
        date: Date,                 // 交易日时间戳
        volume: number,             // 成交量
        commission: number,         // 手续费/佣金
        direction: 'BUY'|'SELL'     // 方向：买入/卖出
    }>
): Promise<{
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
}>;
```

