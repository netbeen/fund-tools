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

### Installation

```console
npm install fund-tools --save
# OR
yarn add fund-tools
```

### API Example

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
