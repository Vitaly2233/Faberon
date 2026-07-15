import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../../../../common/auth/public.decorator';
import { ErrorResponse } from '../../../../common/errors/error-response.dto';
import { AuthenticationService } from '../../application/authentication.service';
import { accessTokenExpiresInSeconds } from '../../infrastructure/security/jwt-access-token.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authentication: AuthenticationService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a company and its first user' })
  @ApiCreatedResponse({ type: RegisterResponse })
  @ApiBadRequestResponse({ description: 'The registration request is invalid.' })
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
  @ApiOperation({ summary: 'Log in to a company' })
  @ApiOkResponse({ type: LoginResponse })
  @ApiBadRequestResponse({ description: 'The login request is invalid.' })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    const accessToken = await this.authentication.login(
      request.companyId,
      request.email,
      request.password,
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: accessTokenExpiresInSeconds,
    };
  }
}
