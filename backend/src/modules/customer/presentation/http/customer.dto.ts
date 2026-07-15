import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';
import { CountryCode, CustomerType } from '../../domain/customer';

export class CreateCustomerRequest {
  @ApiProperty({ example: 'Acme AS', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ enum: CustomerType, example: CustomerType.Company })
  @IsEnum(CustomerType)
  type!: CustomerType;

  @ApiPropertyOptional({ example: 'Acme AS', maxLength: 200, nullable: true })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  legalName?: string | null;

  @ApiPropertyOptional({ example: 'NO999888777', maxLength: 64, nullable: true })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxNumber?: string | null;

  @ApiPropertyOptional({ example: 'Karl Johans gate 1', maxLength: 240, nullable: true })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  address?: string | null;

  @ApiPropertyOptional({ example: 'Oslo', maxLength: 120, nullable: true })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string | null;

  @ApiPropertyOptional({ example: 'Oslo', maxLength: 120, nullable: true })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string | null;

  @ApiPropertyOptional({ example: '0154', maxLength: 32, nullable: true })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  postalCode?: string | null;

  @ApiPropertyOptional({ enum: CountryCode, example: CountryCode.Norway, nullable: true })
  @IsOptional()
  @IsEnum(CountryCode)
  country?: CountryCode | null;

  @ApiPropertyOptional({ example: 'Preferred customer', nullable: true })
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
