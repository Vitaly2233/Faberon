import { strings as en } from '@/constants/i18n/en';
import { strings as pl } from '@/constants/i18n/pl';
import type { AppLocale, AppStrings } from '@/constants/i18n/types';

export const SUPPORTED_LOCALES: AppLocale[] = ['en', 'pl'];

const catalogs: Record<AppLocale, AppStrings> = {
  en,
  pl: pl as AppStrings,
};

export function getStrings(locale: AppLocale): AppStrings {
  return catalogs[locale];
}

export function getDateLocale(locale: AppLocale): string {
  return locale === 'pl' ? 'pl-PL' : 'en-US';
}

export function getMoneyLocale(locale: AppLocale): string {
  return locale === 'pl' ? 'pl-PL' : 'en-US';
}

export type { AppLocale, AppStrings };
