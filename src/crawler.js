/* eslint-disable max-len */
// noinspection JSUnresolvedVariable
import axios from 'axios'
import dayjs from 'dayjs'
import { sortByDate } from './utils'

const utc = require('dayjs/plugin/utc') // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

export const fetchUnitPriceByIdentifier = async (fundIdentifier) => {
  const url = `http://fund.10jqka.com.cn/${fundIdentifier}/json/jsondwjz.json`
  const fetchData = (await axios.get(url)).data
  const fetchResult = fetchData.split('=')[1]
  try {
    let formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs.tz(item[0]).hour(0), price: Number(item[1]) }))
    formattedResult = sortByDate(formattedResult)
    return formattedResult
  } catch (e) {
    throw new Error(`e=${e}, url=${url}, fetchData=${fetchData}`)
  }
}

export const fetchAccumulatedPriceByIdentifier = async (fundIdentifier) => {
  const url = `http://fund.10jqka.com.cn/${fundIdentifier}/json/jsonljjz.json`
  const fetchData = (await axios.get(url)).data
  const fetchResult = fetchData.split('=')[1]
  try {
    let formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs.tz(item[0]).hour(0), price: Number(item[1]) }))
    formattedResult = sortByDate(formattedResult)
    return formattedResult
  } catch (e) {
    throw new Error(`e=${e}, url=${url}, fetchData=${fetchData}`)
  }
}

export const fetchDividendByIdentifier = async (fundIdentifier) => {
  let formattedResult = []
  try {
    const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/fhcf.js`)).data.split(';')[0].split('=')[1]
    formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs.tz(item[0]).hour(0), dividend: Number(item[1]) }))
    formattedResult = sortByDate(formattedResult)
  } catch (e) {
    return []
  }
  return formattedResult
}

export const fetchSplitByIdentifier = async (fundIdentifier) => {
  let formattedResult = []
  try {
    const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/fhcf.js`)).data.split(';')[1].split('=')[1]
    formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs.tz(item[0]).hour(0), splitRatio: Number(item[1]) }))
    formattedResult = sortByDate(formattedResult)
  } catch (e) {
    return []
  }
  return formattedResult
}

export const fetchBasicInfoByIdentifier = async (fundIdentifier) => {
  let formattedResult = null
  try {
    const fetchResult = (await axios.get(`https://fund.10jqka.com.cn/data/client/myfund/${fundIdentifier}`)).data.data[0]
    formattedResult = {
      identifier: fetchResult.code,
      name: fetchResult.name,
      type: fetchResult.fundtype
    }
  } catch (e) {
    return null
  }
  return formattedResult
}
