import {
  fetchBasicInfoByIdentifier, fetchUnitPriceByIdentifier,
  fetchAccumulatedPriceByIdentifier, fetchDividendByIdentifier, fetchSplitByIdentifier
} from '../src'

test('Fetch some example price data', async () => {
  const [unitResult, accumulatedResult, dividendsResult, splitResult] = await Promise.all([
    fetchUnitPriceByIdentifier('519671'),
    fetchAccumulatedPriceByIdentifier('519671'),
    fetchDividendByIdentifier('519671'),
    fetchSplitByIdentifier('512010')
  ])
  expect(unitResult.length).toBeGreaterThan(0)
  expect(accumulatedResult.length).toBeGreaterThan(0)
  expect(dividendsResult.length).toBeGreaterThan(0)
  expect(splitResult.length).toBeGreaterThan(0)
})

test('Fetch basic info', async () => {
  const [validResult, invalidResult] = await Promise.all([
    fetchBasicInfoByIdentifier('160119'),
    fetchBasicInfoByIdentifier('160119invalid')
  ])
  expect(validResult).toEqual({ identifier: '160119', name: '南方中证500ETF联接(LOF)A', type: '股票型' })
  expect(invalidResult).toBeNull()
})

test('Fetch with error', async () => {
  await expect(fetchUnitPriceByIdentifier('160119xxx')).rejects.toThrow()
  await expect(fetchAccumulatedPriceByIdentifier('160119xxx')).rejects.toThrow()
})
