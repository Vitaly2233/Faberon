import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import { ErrorResponse } from '../../../../common/errors/error-response.dto';
import type { AccessTokenClaims } from '../../../users/infrastructure/security/jwt-access-token.service';
import { ProductService } from '../../application/product.service';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './product.dto';

@ApiTags('products')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ type: ProductResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  create(
    @CurrentUser() user: AccessTokenClaims,
    @Body() request: CreateProductRequest,
  ): Promise<ProductResponse> {
    return this.productService.create(user.companyId, request);
  }

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiOkResponse({ type: ProductResponse, isArray: true })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findAll(
    @CurrentUser() user: AccessTokenClaims,
    @Query('customerId', new ParseUUIDPipe({ version: '7', optional: true }))
    customerId?: string,
  ): Promise<ProductResponse[]> {
    return this.productService.findAll(user.companyId, customerId);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get a product' })
  @ApiOkResponse({ type: ProductResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findById(
    @CurrentUser() user: AccessTokenClaims,
    @Param('productId', new ParseUUIDPipe({ version: '7' }))
    productId: string,
  ): Promise<ProductResponse> {
    return this.productService.findById(user.companyId, productId);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({ type: ProductResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  update(
    @CurrentUser() user: AccessTokenClaims,
    @Param('productId', new ParseUUIDPipe({ version: '7' }))
    productId: string,
    @Body() request: UpdateProductRequest,
  ): Promise<ProductResponse> {
    return this.productService.update(user.companyId, productId, request);
  }

  @Delete(':productId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponse })
  async delete(
    @CurrentUser() user: AccessTokenClaims,
    @Param('productId', new ParseUUIDPipe({ version: '7' }))
    productId: string,
  ): Promise<void> {
    await this.productService.delete(user.companyId, productId);
  }
}
