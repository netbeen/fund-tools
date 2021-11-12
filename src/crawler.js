/* eslint-disable max-len */
import axios from 'axios'
import dayjs from 'dayjs'
import { sortByDate } from './utils'

export const fetchUnitPriceByIdentifier = async (fundIdentifier) => {
  const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/json/jsondwjz.json`)).data.split('=')[1]
  let formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs(item[0]).toDate(), price: item[1] }))
  formattedResult = sortByDate(formattedResult)
  return formattedResult
}

export const fetchAccumulatedPriceByIdentifier = async (fundIdentifier) => {
  const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/json/jsonljjz.json`)).data.split('=')[1]
  let formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs(item[0]).toDate(), price: item[1] }))
  formattedResult = sortByDate(formattedResult)
  return formattedResult
}

export const fetchDividendByIdentifier = async (fundIdentifier) => {
  const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/fhcf.js`)).data.split(';')[0].split('=')[1]
  let formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs(item[0]).toDate(), dividend: item[1] }))
  formattedResult = sortByDate(formattedResult)
  return formattedResult
}

export const fetchSplitByIdentifier = async (fundIdentifier) => {
  const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/fhcf.js`)).data.split(';')[1].split('=')[1]
  let formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs(item[0]).toDate(), splitRatio: item[1] }))
  formattedResult = sortByDate(formattedResult)
  return formattedResult
}
