import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';
import { accessTokenExpiresInSeconds } from '../../infrastructure/security/jwt-access-token.service';

export class RegisterRequest {
  @ApiProperty({ example: 'Acme AS', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  companyName!: string;

  @ApiProperty({ example: 'ada@example.com', maxLength: 320 })
  @NormalizeText({ lowercase: true })
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @ApiProperty({ format: 'password', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class RegisterResponse {
  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df6-71ec-8f08-fa907fa17f9d',
  })
  companyId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df7-79fb-b466-fa907fa17f9e',
  })
  userId!: string;

  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ example: accessTokenExpiresInSeconds })
  expiresIn!: number;
}

export class LoginRequest {
  @ApiProperty({ example: 'ada@example.com', maxLength: 320 })
  @NormalizeText({ lowercase: true })
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @ApiProperty({ format: 'password', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ example: accessTokenExpiresInSeconds })
  expiresIn!: number;
}

export class UserResponse {
  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df7-79fb-b466-fa907fa17f9e',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df6-71ec-8f08-fa907fa17f9d',
  })
  companyId!: string;

  @ApiProperty({ example: 'ada@example.com' })
  email!: string;
}
