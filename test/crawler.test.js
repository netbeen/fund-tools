import { fetchUnitPriceByIdentifier, fetchAccumulatedPriceByIdentifier, fetchDividendByIdentifier, fetchSplitByIdentifier } from '../src'

test('Fetch some example data', async () => {
  const [unitResult, accumulatedResult, dividendsResult, splitResult] = await Promise.all([
    fetchUnitPriceByIdentifier('519671'),
    fetchAccumulatedPriceByIdentifier('519671'),
    fetchDividendByIdentifier('519671'),
    fetchSplitByIdentifier('512010')])
  expect(unitResult.length).toBeGreaterThan(0)
  expect(accumulatedResult.length).toBeGreaterThan(0)
  expect(dividendsResult.length).toBeGreaterThan(0)
  expect(splitResult.length).toBeGreaterThan(0)
})
