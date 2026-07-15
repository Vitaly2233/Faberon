import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';
import { CountryCode, CurrencyCode } from '../../domain/customer';

export class CreateBillingInformationRequest {
  @ApiProperty({ example: 'Karl Johans gate 1', minLength: 1, maxLength: 240 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(240)
  address!: string;

  @ApiProperty({ example: 'Oslo', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  city!: string;

  @ApiPropertyOptional({ example: 'Oslo', maxLength: 120, nullable: true })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string | null;

  @ApiProperty({ example: '0154', minLength: 1, maxLength: 32 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  postalCode!: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.Norway })
  @IsEnum(CountryCode)
  country!: CountryCode;

  @ApiProperty({ example: 14, minimum: 0, maximum: 365 })
  @IsInt()
  @Min(0)
  @Max(365)
  dueWithinDays!: number;

  @ApiProperty({ enum: CurrencyCode, example: CurrencyCode.NorwegianKrone })
  @IsEnum(CurrencyCode)
  currency!: CurrencyCode;
}

export class BillingInformationResponse {
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
  address!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ nullable: true, type: String })
  region!: string | null;

  @ApiProperty()
  postalCode!: string;

  @ApiProperty({ enum: CountryCode })
  country!: CountryCode;

  @ApiProperty({ minimum: 0, maximum: 365 })
  dueWithinDays!: number;

  @ApiProperty({ enum: CurrencyCode })
  currency!: CurrencyCode;
}
