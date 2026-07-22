import { decodeJwtPayload } from '@/services/api/jwt';

describe('decodeJwtPayload', () => {
  it('decodes a JWT payload', () => {
    const payload = {
      sub: 'user-1',
      companyId: 'company-1',
      email: 'ada@example.com',
    };
    const encoded = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
    const token = `header.${encoded}.signature`;

    expect(decodeJwtPayload(token)).toEqual(payload);
  });
});
