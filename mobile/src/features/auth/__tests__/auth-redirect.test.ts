import { getRoleHomePath } from '@/features/auth/auth-redirect';

describe('getRoleHomePath', () => {
  it('returns customer home for CUSTOMER role', () => {
    expect(getRoleHomePath('CUSTOMER')).toBe('/(customer)/');
  });

  it('returns technician home for TECHNICIAN role', () => {
    expect(getRoleHomePath('TECHNICIAN')).toBe('/(technician)/');
  });

  it('returns owner home for OWNER role', () => {
    expect(getRoleHomePath('OWNER')).toBe('/(owner)/');
  });
});
