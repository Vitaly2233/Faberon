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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../../common/errors/error-response.dto';
import { ProductCategoryService } from '../../application/product-category.service';
import {
  CreateProductCategoryRequest,
  CreateProductTypeRequest,
  ProductCategoryResponse,
  ProductTypeResponse,
  UpdateProductCategoryRequest,
  UpdateProductTypeRequest,
} from './product-category.dto';

@ApiTags('product-categories')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ProductCategoryResponse })
  create(
    @Body() request: CreateProductCategoryRequest,
  ): Promise<ProductCategoryResponse> {
    return this.productCategoryService.create(request);
  }

  @Post(':categoryId/types')
  @ApiCreatedResponse({ type: ProductTypeResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  createType(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
    @Body() request: CreateProductTypeRequest,
  ): Promise<ProductTypeResponse> {
    return this.productCategoryService.createType(categoryId, request);
  }

  @Get()
  @ApiOkResponse({ type: ProductCategoryResponse, isArray: true })
  findAll(): Promise<ProductCategoryResponse[]> {
    return this.productCategoryService.findAll();
  }

  @Get(':categoryId')
  @ApiOkResponse({ type: ProductCategoryResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findById(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
  ): Promise<ProductCategoryResponse> {
    return this.productCategoryService.findById(categoryId);
  }

  @Get(':categoryId/types')
  @ApiOkResponse({ type: ProductTypeResponse, isArray: true })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findTypes(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
  ): Promise<ProductTypeResponse[]> {
    return this.productCategoryService.findTypes(categoryId);
  }

  @Get(':categoryId/types/:typeId')
  @ApiOkResponse({ type: ProductTypeResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findTypeById(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
    @Param('typeId', new ParseUUIDPipe({ version: '7' }))
    typeId: string,
  ): Promise<ProductTypeResponse> {
    return this.productCategoryService.findTypeById(categoryId, typeId);
  }

  @Patch(':categoryId')
  @ApiOkResponse({ type: ProductCategoryResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  update(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
    @Body() request: UpdateProductCategoryRequest,
  ): Promise<ProductCategoryResponse> {
    return this.productCategoryService.update(categoryId, request);
  }

  @Patch(':categoryId/types/:typeId')
  @ApiOkResponse({ type: ProductTypeResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  updateType(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
    @Param('typeId', new ParseUUIDPipe({ version: '7' }))
    typeId: string,
    @Body() request: UpdateProductTypeRequest,
  ): Promise<ProductTypeResponse> {
    return this.productCategoryService.updateType(
      categoryId,
      typeId,
      request,
    );
  }

  @Delete(':categoryId')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponse })
  async delete(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
  ): Promise<void> {
    await this.productCategoryService.delete(categoryId);
  }

  @Delete(':categoryId/types/:typeId')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponse })
  async deleteType(
    @Param('categoryId', new ParseUUIDPipe({ version: '7' }))
    categoryId: string,
    @Param('typeId', new ParseUUIDPipe({ version: '7' }))
    typeId: string,
  ): Promise<void> {
    await this.productCategoryService.deleteType(categoryId, typeId);
  }
}
