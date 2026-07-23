import type { Href } from 'expo-router';

import type { AuthSession } from '@/types/auth';

export function getRoleHomePath(role: AuthSession['user']['role']): Href {
  switch (role) {
    case 'CUSTOMER':
      return '/(customer)/' as Href;
    case 'TECHNICIAN':
      return '/(technician)/' as Href;
    case 'OWNER':
      return '/(owner)/' as Href;
    default:
      return '/(auth)/login';
  }
}
