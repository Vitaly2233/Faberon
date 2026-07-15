import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../../domain/user';

export const accessTokenExpiresInSeconds = 24 * 60 * 60;

export interface AccessTokenClaims {
  sub: string;
  companyId: string;
  email: string;
}

@Injectable()
export class JwtAccessTokenService {
  constructor(private readonly jwt: JwtService) {}

  issue(user: User): Promise<string> {
    return this.jwt.signAsync(
      { companyId: user.companyId, email: user.email },
      { subject: user.id },
    );
  }

  async verify(token: string): Promise<AccessTokenClaims> {
    const claims = await this.jwt.verifyAsync<Partial<AccessTokenClaims>>(token);
    if (
      typeof claims.sub !== 'string' ||
      typeof claims.companyId !== 'string' ||
      typeof claims.email !== 'string'
    ) {
      throw new Error('The access token payload is invalid.');
    }

    return {
      sub: claims.sub,
      companyId: claims.companyId,
      email: claims.email,
    };
  }
}
