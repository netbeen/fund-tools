/* eslint-disable max-len */
import axios from 'axios'
import dayjs from 'dayjs'

export const fetchUnitPriceByIdentifier = async (fundIdentifier) => {
  const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/json/jsondwjz.json`)).data.split('=')[1]
  const formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs(item[0]).toDate(), price: item[1] }))
  return formattedResult
}

export const fetchAccumulatedPriceByIdentifier = async (fundIdentifier) => {
  const fetchResult = (await axios.get(`http://fund.10jqka.com.cn/${fundIdentifier}/json/jsonljjz.json`)).data.split('=')[1]
  const formattedResult = JSON.parse(fetchResult).map(item => ({ date: dayjs(item[0]).toDate(), price: item[1] }))
  return formattedResult
}

export const useless = 1
