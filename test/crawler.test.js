import { fetchUnitPriceByIdentifier } from '../src'
import { fetchAccumulatedPriceByIdentifier } from '../src/crawler'

it('calcReturn Test', async () => {
  const unitResult = await fetchUnitPriceByIdentifier('519671')
  console.log('unitResult', unitResult)

  const accumulatedResult = await fetchAccumulatedPriceByIdentifier('519671')
  console.log('accumulatedResult', accumulatedResult)
})
