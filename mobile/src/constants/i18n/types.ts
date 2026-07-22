import type { strings as englishStrings } from '@/constants/i18n/en';

type Stringify<T> = T extends string ? string : { [K in keyof T]: Stringify<T[K]> };

export type AppStrings = Stringify<typeof englishStrings>;
export type AppLocale = 'en' | 'pl';
