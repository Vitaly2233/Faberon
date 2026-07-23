import { useMemo } from 'react';

import { getDateLocale, getMoneyLocale, getStrings } from '@/constants/i18n';
import type { AppLocale, AppStrings } from '@/constants/i18n/types';
import { useLocaleStore } from '@/features/i18n/locale.store';

export function useStrings(): AppStrings {
  const locale = useLocaleStore((state) => state.locale);
  return useMemo(() => getStrings(locale), [locale]);
}

export function useI18n() {
  const locale = useLocaleStore((state) => state.locale);
  const hydrated = useLocaleStore((state) => state.hydrated);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const strings = useMemo(() => getStrings(locale), [locale]);
  const dateLocale = useMemo(() => getDateLocale(locale), [locale]);
  const moneyLocale = useMemo(() => getMoneyLocale(locale), [locale]);

  return {
    locale,
    hydrated,
    setLocale,
    strings,
    dateLocale,
    moneyLocale,
  };
}

export type { AppLocale };
