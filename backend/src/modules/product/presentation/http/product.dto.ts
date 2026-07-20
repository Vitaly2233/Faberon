import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';
import { ProductOwnership } from '../../domain/product';

export class CreateProductRequest {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('7')
  customerId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('7')
  typeId!: string;

  @ApiProperty({ example: 'HP', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  manufacturer!: string;

  @ApiProperty({ example: 'LaserJet M607', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  model!: string;

  @ApiProperty({ example: 'SN-HP-88213', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  serialNumber!: string;

  @ApiProperty({ enum: ProductOwnership, example: ProductOwnership.ByClient })
  @IsEnum(ProductOwnership)
  ownership!: ProductOwnership;

  @ApiPropertyOptional({
    type: String,
    example: '88 Beachline Dr',
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
    example: 'Front desk',
    maxLength: 120,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactName?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    example: '2027-01-15',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  warrantyDate?: string | null;
}

export class UpdateProductRequest {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('7')
  customerId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('7')
  typeId?: string;

  @ApiPropertyOptional({ example: 'HP', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  manufacturer?: string;

  @ApiPropertyOptional({ example: 'LaserJet M607', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  model?: string;

  @ApiPropertyOptional({ example: 'SN-HP-88213', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  serialNumber?: string;

  @ApiPropertyOptional({ enum: ProductOwnership, example: ProductOwnership.ByClient })
  @IsOptional()
  @IsEnum(ProductOwnership)
  ownership?: ProductOwnership;

  @ApiPropertyOptional({
    type: String,
    example: '88 Beachline Dr',
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
    example: 'Front desk',
    maxLength: 120,
    nullable: true,
  })
  @NormalizeText({ emptyToNull: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactName?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    example: '2027-01-15',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  warrantyDate?: string | null;
}

export class ProductResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  companyId!: string;

  @ApiProperty({ format: 'uuid' })
  customerId!: string;

  @ApiProperty({ format: 'uuid' })
  typeId!: string;

  @ApiProperty()
  manufacturer!: string;

  @ApiProperty()
  model!: string;

  @ApiProperty()
  serialNumber!: string;

  @ApiProperty({ nullable: true, type: String })
  address!: string | null;

  @ApiProperty({ nullable: true, type: String })
  contactName!: string | null;

  @ApiProperty({ nullable: true, type: String, format: 'date' })
  warrantyDate!: string | null;

  @ApiProperty({ enum: ProductOwnership })
  ownership!: ProductOwnership;
}
