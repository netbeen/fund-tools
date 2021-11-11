import { fetchUnitPriceByIdentifier } from '../src'
import { fetchAccumulatedPriceByIdentifier, fetchDividendByIdentifier, fetchSplitByIdentifier } from '../src/crawler'

it('calcReturn Test', async () => {
  const unitResult = await fetchUnitPriceByIdentifier('519671')
  console.log('unitResult', unitResult)

  const accumulatedResult = await fetchAccumulatedPriceByIdentifier('519671')
  console.log('accumulatedResult', accumulatedResult)

  const dividendsResult = await fetchDividendByIdentifier('519671')
  console.log('dividendsResult', dividendsResult)

  const splitResult = await fetchSplitByIdentifier('512010')
  console.log('splitResult', splitResult)
})
