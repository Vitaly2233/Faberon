import { MockAuthService } from '@/services/auth/mock-auth.service';

describe('MockAuthService', () => {
  it('logs in as technician when email matches the technician mock user', async () => {
    const auth = new MockAuthService();

    const session = await auth.login({
      email: 'mike@faberon.com',
      password: 'password',
    });

    expect(session.user.role).toBe('TECHNICIAN');
    expect(session.user.email).toBe('mike@faberon.com');
    expect(session.user.id).toBe('tech-1');
  });

  it('logs in as customer when email matches the customer mock user', async () => {
    const auth = new MockAuthService();

    const session = await auth.login({
      email: 'j.doe@grandhotel.com',
      password: 'password',
    });

    expect(session.user.role).toBe('CUSTOMER');
  });

  it('falls back to the dev-selected role for unknown emails', async () => {
    const auth = new MockAuthService();
    auth.setDevRole('OWNER');

    const session = await auth.login({
      email: 'custom@example.com',
      password: 'password',
    });

    expect(session.user.role).toBe('OWNER');
    expect(session.user.email).toBe('custom@example.com');
  });
});
