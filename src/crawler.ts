import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { sortByDate } from './utils';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

const fundDataApiHost = 'https://fund.10jqka.com.cn';

export interface DatePrice {
  date: Dayjs;
  price: number;
}

export interface DateDividend {
  date: Dayjs;
  dividend: number;
}
export interface DateSplitRatio {
  date: Dayjs;
  splitRatio: number;
}

export interface BasicInfo {
  identifier: string;
  name: string;
  type: string;
}

const fetchPriceByIdentifier = async (
  fundIdentifier: string,
  filename: string,
) => {
  const url = `${fundDataApiHost}/${fundIdentifier}/json/${filename}`;
  const fetchData = (await axios.get(url)).data;
  const fetchResult = fetchData.split('=')[1];
  try {
    let formattedResult: DatePrice[] = JSON.parse(fetchResult).map(
      (item: any) => ({
        date: dayjs.tz(item[0]).hour(0),
        price: Number(item[1]),
      }),
    );
    formattedResult = sortByDate<DatePrice>(formattedResult);
    return formattedResult;
  } catch (e) {
    throw new Error(`e=${e}, url=${url}, fetchData=${fetchData}`);
  }
};

export const fetchUnitPriceByIdentifier = async (fundIdentifier: string) => {
  return await fetchPriceByIdentifier(fundIdentifier, 'jsondwjz.json');
};

export const fetchAccumulatedPriceByIdentifier = async (
  fundIdentifier: string,
) => {
  return await fetchPriceByIdentifier(fundIdentifier, 'jsonljjz.json');
};

export const fetchDividendByIdentifier = async (fundIdentifier: string) => {
  let formattedResult: DateDividend[] = [];
  try {
    const fetchResult = (
      await axios.get(`${fundDataApiHost}/${fundIdentifier}/fhcf.js`)
    ).data
      .split(';')[0]
      .split('=')[1];
    formattedResult = JSON.parse(fetchResult).map((item: any) => ({
      date: dayjs.tz(item[0]).hour(0),
      dividend: Number(item[1]),
    }));
    formattedResult = sortByDate<DateDividend>(formattedResult);
  } catch (e) {
    return formattedResult;
  }
  return formattedResult;
};

export const fetchSplitByIdentifier = async (fundIdentifier: string) => {
  let formattedResult: DateSplitRatio[] = [];
  try {
    const fetchResult = (
      await axios.get(`${fundDataApiHost}/${fundIdentifier}/fhcf.js`)
    ).data
      .split(';')[1]
      .split('=')[1];
    formattedResult = JSON.parse(fetchResult).map((item: any) => ({
      date: dayjs.tz(item[0]).hour(0),
      splitRatio: Number(item[1]),
    }));
    formattedResult = sortByDate(formattedResult);
  } catch (e) {
    return formattedResult;
  }
  return formattedResult;
};

export const fetchBasicInfoByIdentifier = async (fundIdentifier: string) => {
  let formattedResult: BasicInfo | null = null;
  try {
    const fetchResult = (
      await axios.get(`${fundDataApiHost}/data/client/myfund/${fundIdentifier}`)
    ).data.data[0];
    formattedResult = {
      identifier: fetchResult.code,
      name: fetchResult.name,
      type: fetchResult.fundtype,
    };
  } catch (e) {
    return null;
  }
  return formattedResult;
};
