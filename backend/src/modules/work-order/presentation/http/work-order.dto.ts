import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';
import { WorkOrderStage } from '../../domain/work-order';

export class CreateWorkOrderRequest {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('7')
  customerId!: string;

  @ApiProperty({
    example: 'Paper jams repeatedly.',
    minLength: 1,
    maxLength: 4000,
  })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  description!: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true, type: String })
  @IsOptional()
  @IsUUID('7')
  productId?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true, type: String })
  @IsOptional()
  @IsUUID('7')
  workerId?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    example: '2026-07-24',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  estimatedDate?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  showFinalPrice?: boolean;
}

export class UpdateWorkOrderRequest {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('7')
  customerId?: string;

  @ApiPropertyOptional({
    example: 'Paper jams repeatedly.',
    minLength: 1,
    maxLength: 4000,
  })
  @NormalizeText()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  description?: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true, type: String })
  @IsOptional()
  @IsUUID('7')
  productId?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true, type: String })
  @IsOptional()
  @IsUUID('7')
  workerId?: string | null;

  @ApiPropertyOptional({ enum: WorkOrderStage })
  @IsOptional()
  @IsEnum(WorkOrderStage)
  stage?: WorkOrderStage;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    example: '2026-07-24',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  estimatedDate?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  showFinalPrice?: boolean;
}

export class WorkOrderResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  companyId!: string;

  @ApiProperty({ format: 'uuid' })
  customerId!: string;

  @ApiProperty({ format: 'uuid', nullable: true, type: String })
  productId!: string | null;

  @ApiProperty({ format: 'uuid', nullable: true, type: String })
  workerId!: string | null;

  @ApiProperty({ example: 1042 })
  number!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: WorkOrderStage })
  stage!: WorkOrderStage;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ nullable: true, type: String, format: 'date' })
  estimatedDate!: string | null;

  @ApiProperty()
  showFinalPrice!: boolean;
}

export class CreateExtraExpenseRequest {
  @ApiProperty({ example: 'Fuser assembly', minLength: 1, maxLength: 200 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiProperty({ example: '210.00' })
  @IsNumberString()
  price!: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}

export class UpdateExtraExpenseRequest {
  @ApiPropertyOptional({
    example: 'Fuser assembly',
    minLength: 1,
    maxLength: 200,
  })
  @NormalizeText()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: '210.00' })
  @IsOptional()
  @IsNumberString()
  price?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}

export class ExtraExpenseResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  workOrderId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: '210.00' })
  price!: string;

  @ApiProperty()
  isHidden!: boolean;
}

export class CreateWorkOrderHistoryRequest {
  @ApiProperty({ example: 'Assigned to self.', minLength: 1, maxLength: 4000 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  text!: string;
}

export class WorkOrderHistoryItemResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  workOrderId!: string;

  @ApiProperty({ format: 'uuid', nullable: true, type: String })
  workerId!: string | null;

  @ApiProperty()
  text!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;
}
