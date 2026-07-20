import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';
import { CountryCode, CustomerType } from '../../domain/customer';
import { CreateContactRequest } from './contact.dto';

export class CreateCustomerRequest {
  @ApiProperty({ example: 'Acme AS', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({
    enum: CustomerType,
    example: CustomerType.Company,
    description: 'Defaults to company when omitted.',
  })
  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  @ApiPropertyOptional({
    type: String,
    example: 'Acme AS',
    maxLength: 200,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  legalName?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'NO999888777',
    maxLength: 64,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxNumber?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Karl Johans gate 1',
    maxLength: 240,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  address?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Oslo',
    maxLength: 120,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Oslo',
    maxLength: 120,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '0154',
    maxLength: 32,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  postalCode?: string | null;

  @ApiPropertyOptional({ enum: CountryCode, example: CountryCode.Norway, nullable: true })
  @IsOptional()
  @IsEnum(CountryCode)
  country?: CountryCode | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Preferred customer',
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string | null;

  @ApiPropertyOptional({ type: () => CreateContactRequest })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateContactRequest)
  contact?: CreateContactRequest;
}

export class UpdateCustomerRequest {
  @ApiPropertyOptional({ example: 'Acme AS', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ enum: CustomerType, example: CustomerType.Company })
  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  @ApiPropertyOptional({
    type: String,
    example: 'Acme AS',
    maxLength: 200,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  legalName?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'NO999888777',
    maxLength: 64,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxNumber?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Karl Johans gate 1',
    maxLength: 240,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  address?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Oslo',
    maxLength: 120,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Oslo',
    maxLength: 120,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '0154',
    maxLength: 32,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  postalCode?: string | null;

  @ApiPropertyOptional({ enum: CountryCode, example: CountryCode.Norway, nullable: true })
  @IsOptional()
  @IsEnum(CountryCode)
  country?: CountryCode | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Preferred customer',
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string | null;
}

export class CustomerResponse {
  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df7-79fb-b466-fa907fa17f9e',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '019535d9-3df7-79fb-b466-fa907fa17f9e',
  })
  companyId!: string;

  @ApiProperty({ example: 'Acme AS' })
  name!: string;

  @ApiProperty({ enum: CustomerType })
  type!: CustomerType;

  @ApiProperty({ nullable: true, type: String })
  legalName!: string | null;

  @ApiProperty({ nullable: true, type: String })
  taxNumber!: string | null;

  @ApiProperty({ nullable: true, type: String })
  address!: string | null;

  @ApiProperty({ nullable: true, type: String })
  city!: string | null;

  @ApiProperty({ nullable: true, type: String })
  region!: string | null;

  @ApiProperty({ nullable: true, type: String })
  postalCode!: string | null;

  @ApiProperty({ enum: CountryCode, nullable: true })
  country!: CountryCode | null;

  @ApiProperty({ nullable: true, type: String })
  notes!: string | null;
}
