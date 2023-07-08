import { calcReturn, calcVolume, DateSplitRatio } from '..';
import {
  getMockOperationsOnAnnualizedRateOfReturnOne,
  getMockUnitPriceOnAnnualizedRateOfReturnOne,
} from '../testUtils';
import { mockOperations1 } from './mockOperations';

test('Mock Data 测试 买入/年化收益率', async () => {
  const result = calcReturn(
    getMockUnitPriceOnAnnualizedRateOfReturnOne(),
    [],
    [],
    getMockOperationsOnAnnualizedRateOfReturnOne(),
  );
  expect(result.unitPrice).toBe(1.1);
  expect(result.unitCost).toBe(1.026);
  expect(result.volume).toBe(0);
  expect(result.totalCommission).toBe(3);
  expect(result.positionReturn).toBe(0);
  expect(result.positionCost).toBe(0);
  expect(result.positionValue).toBe(0);
  expect(result.positionRateOfReturn).toBeNaN();
  expect(result.exitReturn).toBe(147.00000000000014);
  expect(result.totalReturn).toBe(147.00000000000014);
  expect(result.totalCost).toBe(2052);
  expect(result.totalRateOfReturn).toBe(0.07163742690058486);
  // expect(result.totalAnnualizedRateOfReturn).toBe(0.057483578798732005)
  expect(result.totalAnnualizedRateOfReturn).toBe(0.046234386144782175);
});

test('Test for invalid params', () => {
  expect(() => {
    calcReturn([], [], [], []);
  }).toThrow('Param operations received []');
  expect(() => {
    calcVolume([], []);
  }).toThrow(
    new Error(
      'Param operations received [], at least one operation is required.',
    ),
  );
});

describe('calcVolume () test', () => {
  test('Happy path', () => {
    const volume = calcVolume([] as DateSplitRatio[], mockOperations1);
    expect(volume).toBe(0);
  });

  test('Split before the open day', () => {
    const volume = calcVolume(
      [
        {
          date: mockOperations1[0].date.subtract(1, 'day'),
          splitRatio: 1.5,
        },
      ] as DateSplitRatio[],
      mockOperations1,
    );
    expect(volume).toBe(0);
  });

  test('Split at the open day', () => {
    const volume = calcVolume(
      [
        {
          date: mockOperations1[0].date,
          splitRatio: 1.5,
        },
      ] as DateSplitRatio[],
      mockOperations1,
    );
    expect(volume).toBe(0);
  });

  test('Split after the open day', () => {
    const volume = calcVolume(
      [
        {
          date: mockOperations1[0].date.add(1, 'day'),
          splitRatio: 1.5,
        },
      ] as DateSplitRatio[],
      mockOperations1,
    );
    expect(volume).toBe(500);
  });

  test('Edge: Sell twice (duplicate operations)', () => {
    const lastOperation = mockOperations1[mockOperations1.length - 1];
    const volume = calcVolume([] as DateSplitRatio[], [
      ...mockOperations1,
      {
        ...lastOperation,
        date: lastOperation.date.add(1, 'day'),
      },
    ]);
    expect(volume).toBe(-2000);
  });
});
