import { authSessionSchema } from '@/schemas/session.schema';

describe('authSessionSchema', () => {
  it('accepts a valid session', () => {
    const result = authSessionSchema.safeParse({
      accessToken: 'token-123',
      user: {
        id: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'CUSTOMER',
        tenantId: 'tenant-1',
        customerId: 'customer-1',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects a session with an invalid role', () => {
    const result = authSessionSchema.safeParse({
      accessToken: 'token-123',
      user: {
        id: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'ADMIN',
        tenantId: 'tenant-1',
      },
    });

    expect(result.success).toBe(false);
  });

  it('rejects a session without an access token', () => {
    const result = authSessionSchema.safeParse({
      accessToken: '',
      user: {
        id: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'CUSTOMER',
        tenantId: 'tenant-1',
      },
    });

    expect(result.success).toBe(false);
  });
});
