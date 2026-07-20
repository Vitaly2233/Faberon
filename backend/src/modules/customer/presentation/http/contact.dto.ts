import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';

export class CreateContactRequest {
  @ApiProperty({ example: 'Ada Lovelace', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'ada@example.com',
    maxLength: 320,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true, lowercase: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '+4798765432',
    maxLength: 32,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(32)
  phone?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Primary contact',
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;
}

export class UpdateContactRequest {
  @ApiPropertyOptional({ example: 'Ada Lovelace', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'ada@example.com',
    maxLength: 320,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true, lowercase: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '+4798765432',
    maxLength: 32,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(32)
  phone?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Primary contact',
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;
}

export class ContactResponse {
  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df8-7abc-8def-fa907fa17f9f',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df7-79fb-b466-fa907fa17f9e',
  })
  customerId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true, type: String })
  email!: string | null;

  @ApiProperty({ nullable: true, type: String })
  phone!: string | null;

  @ApiProperty({ nullable: true, type: String })
  description!: string | null;
}
