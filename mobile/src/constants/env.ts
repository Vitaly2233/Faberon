export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
  devRoleSwitcher: (process.env.EXPO_PUBLIC_DEV_ROLE_SWITCHER ?? 'false') === 'true',
} as const;
