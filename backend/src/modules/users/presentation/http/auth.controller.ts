import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import { Public } from '../../../../common/auth/public.decorator';
import { ErrorResponse } from '../../../../common/errors/error-response.dto';
import { AuthenticationService } from '../../application/authentication.service';
import {
  accessTokenExpiresInSeconds,
  type AccessTokenClaims,
} from '../../infrastructure/security/jwt-access-token.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserResponse,
} from './auth.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authentication: AuthenticationService) {}

  @Public()
  @Post('register')
  @ApiCreatedResponse({ type: RegisterResponse })
  async register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
    const result = await this.authentication.register(
      request.companyName,
      request.email,
      request.password,
    );

    return {
      companyId: result.company.id,
      userId: result.user.id,
      accessToken: result.accessToken,
      tokenType: 'Bearer',
      expiresIn: accessTokenExpiresInSeconds,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    const accessToken = await this.authentication.login(
      request.email,
      request.password,
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: accessTokenExpiresInSeconds,
    };
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponse })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  me(@CurrentUser() user: AccessTokenClaims): Promise<UserResponse> {
    return this.authentication.me(user);
  }
}
