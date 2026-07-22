import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import type { AppLocale } from '@/constants/i18n/types';

const LOCALE_STORAGE_KEY = 'faberon-app-locale';

interface LocaleState {
  locale: AppLocale;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setLocale: (locale: AppLocale) => Promise<void>;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'en',
  hydrated: false,
  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(LOCALE_STORAGE_KEY);
      if (stored === 'en' || stored === 'pl') {
        set({ locale: stored, hydrated: true });
        return;
      }
    } catch {
      // SecureStore may be unavailable on web preview.
    }
    set({ hydrated: true });
  },
  setLocale: async (locale) => {
    try {
      await SecureStore.setItemAsync(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Persist best-effort; in-memory locale still updates.
    }
    set({ locale });
  },
}));
