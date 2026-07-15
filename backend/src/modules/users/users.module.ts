import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './application/authentication.service';
import {
  accessTokenExpiresInSeconds,
} from './infrastructure/security/jwt-access-token.service';
import { CompanyRepository } from './infrastructure/database/company.repository';
import { UserRepository } from './infrastructure/database/user.repository';
import { JwtAccessTokenService } from './infrastructure/security/jwt-access-token.service';
import { ScryptPasswordHasher } from './infrastructure/security/scrypt-password-hasher';
import { AuthController } from './presentation/http/auth.controller';
import { JwtAuthGuard } from './presentation/http/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: accessTokenExpiresInSeconds,
        },
        verifyOptions: { algorithms: ['HS256'] },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    CompanyRepository,
    UserRepository,
    AuthenticationService,
    ScryptPasswordHasher,
    JwtAccessTokenService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class UsersModule {}
