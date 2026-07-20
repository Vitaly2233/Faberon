import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { NormalizeText } from '../../../../common/validation/normalize-text.decorator';

export class CreateProductCategoryRequest {
  @ApiProperty({ example: 'Printers', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}

export class UpdateProductCategoryRequest {
  @ApiProperty({ example: 'Printers', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}

export class ProductCategoryResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;
}

export class CreateProductTypeRequest {
  @ApiProperty({ example: 'Laser', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}

export class UpdateProductTypeRequest {
  @ApiProperty({ example: 'Laser', minLength: 1, maxLength: 120 })
  @NormalizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}

export class ProductTypeResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  categoryId!: string;

  @ApiProperty()
  name!: string;
}
