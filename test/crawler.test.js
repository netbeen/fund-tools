import { fetchUnitPriceByIdentifier } from '../src'
import { fetchAccumulatedPriceByIdentifier, fetchDividendByIdentifier, fetchSplitByIdentifier } from '../src/crawler'

it('calcReturn Test', async () => {
  const unitResult = await fetchUnitPriceByIdentifier('519671')
  console.log('unitResult', unitResult.length)

  const accumulatedResult = await fetchAccumulatedPriceByIdentifier('519671')
  console.log('accumulatedResult', accumulatedResult.length)

  const dividendsResult = await fetchDividendByIdentifier('519671')
  console.log('dividendsResult', dividendsResult.length)

  const splitResult = await fetchSplitByIdentifier('512010')
  console.log('splitResult', splitResult.length)
})
