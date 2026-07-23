import type { MoneyMinor } from '@/types/money';

const DEFAULT_CURRENCY = 'PLN';

export function formatMoneyMinor(
  amountMinor: MoneyMinor,
  currency = DEFAULT_CURRENCY,
  locale = 'pl-PL',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amountMinor / 100);
}

export function sumMoneyMinor(values: MoneyMinor[]): MoneyMinor {
  return values.reduce((total, value) => total + value, 0);
}

export function multiplyMoneyMinor(unitMinor: MoneyMinor, quantity: number): MoneyMinor {
  return Math.round(unitMinor * quantity);
}

export function moneyMinorToFormString(amountMinor: MoneyMinor): string {
  return (amountMinor / 100).toFixed(2);
}

export function parseMoneyStringToMinor(value: string): MoneyMinor {
  const normalized = value.replace(',', '.').trim();
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid money string: ${value}`);
  }
  return Math.round(parsed * 100);
}
