import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../../common/auth/public.decorator';
import {
  type AccessTokenClaims,
  JwtAccessTokenService,
} from '../../infrastructure/security/jwt-access-token.service';

interface AuthenticatedRequest {
  headers: { authorization?: string };
  user?: AccessTokenClaims;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenService: JwtAccessTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request.headers.authorization);
    if (!token) throw new UnauthorizedException('Authentication is required.');

    try {
      request.user = await this.accessTokenService.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException('The access token is invalid or expired.');
    }
  }

  private extractBearerToken(authorization: string | undefined): string | null {
    if (!authorization) return null;

    const [scheme, token, extra] = authorization.split(' ');
    return scheme?.toLowerCase() === 'bearer' && token && extra === undefined
      ? token
      : null;
  }
}
