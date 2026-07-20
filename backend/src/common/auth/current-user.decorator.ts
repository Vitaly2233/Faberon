import {
  createParamDecorator,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import type { AccessTokenClaims } from '../../modules/users/infrastructure/security/jwt-access-token.service';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AccessTokenClaims => {
    const request = context.switchToHttp().getRequest<{ user?: AccessTokenClaims }>();
    if (!request.user) {
      throw new UnauthorizedException('Authentication is required.');
    }
    return request.user;
  },
);
