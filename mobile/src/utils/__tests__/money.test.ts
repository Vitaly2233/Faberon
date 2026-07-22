import { formatMoneyMinor, multiplyMoneyMinor, parseMoneyStringToMinor, sumMoneyMinor } from '@/utils/money';

describe('money utils', () => {
  it('formats minor units as currency', () => {
    expect(formatMoneyMinor(21000, 'PLN', 'pl-PL')).toMatch(/210/);
  });

  it('sums minor units without floating point drift', () => {
    expect(sumMoneyMinor([100, 250, 50])).toBe(400);
  });

  it('multiplies quantity using rounded minor units', () => {
    expect(multiplyMoneyMinor(199, 3)).toBe(597);
  });

  it('parses decimal strings into minor units', () => {
    expect(parseMoneyStringToMinor('12.34')).toBe(1234);
    expect(parseMoneyStringToMinor('12,34')).toBe(1234);
  });
});
