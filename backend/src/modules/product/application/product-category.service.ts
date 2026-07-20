import { Injectable } from '@nestjs/common';
import type { ProductCategory, ProductType } from '../domain/product';
import {
  ProductCategoryNotFoundError,
  ProductTypeNotFoundError,
} from '../domain/product.errors';
import { ProductCategoryRepository } from '../infrastructure/database/product-category.repository';
import { ProductTypeRepository } from '../infrastructure/database/product-type.repository';
import type {
  CreateProductCategoryRequest,
  CreateProductTypeRequest,
  UpdateProductCategoryRequest,
  UpdateProductTypeRequest,
} from '../presentation/http/product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly productTypeRepository: ProductTypeRepository,
  ) {}

  create(input: CreateProductCategoryRequest): Promise<ProductCategory> {
    return this.productCategoryRepository.create({ name: input.name });
  }

  findAll(): Promise<ProductCategory[]> {
    return this.productCategoryRepository.findAll();
  }

  async findById(categoryId: string): Promise<ProductCategory> {
    return this.requireById(categoryId);
  }

  async update(
    categoryId: string,
    input: UpdateProductCategoryRequest,
  ): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.updateById(
      categoryId,
      { name: input.name },
    );
    if (!category) throw new ProductCategoryNotFoundError(categoryId);
    return category;
  }

  async delete(categoryId: string): Promise<ProductCategory> {
    const category =
      await this.productCategoryRepository.deleteById(categoryId);
    if (!category) throw new ProductCategoryNotFoundError(categoryId);
    return category;
  }

  async createType(
    categoryId: string,
    input: CreateProductTypeRequest,
  ): Promise<ProductType> {
    await this.requireById(categoryId);
    return this.productTypeRepository.create({
      categoryId,
      name: input.name,
    });
  }

  async findTypes(categoryId: string): Promise<ProductType[]> {
    await this.requireById(categoryId);
    return this.productTypeRepository.findAllByCategoryId(categoryId);
  }

  async findTypeById(
    categoryId: string,
    typeId: string,
  ): Promise<ProductType> {
    await this.requireById(categoryId);
    const type = await this.productTypeRepository.findByIdForCategory(
      typeId,
      categoryId,
    );
    if (!type) throw new ProductTypeNotFoundError(typeId);
    return type;
  }

  async updateType(
    categoryId: string,
    typeId: string,
    input: UpdateProductTypeRequest,
  ): Promise<ProductType> {
    await this.requireById(categoryId);
    const type = await this.productTypeRepository.updateByIdForCategory(
      typeId,
      categoryId,
      { name: input.name },
    );
    if (!type) throw new ProductTypeNotFoundError(typeId);
    return type;
  }

  async deleteType(
    categoryId: string,
    typeId: string,
  ): Promise<ProductType> {
    await this.requireById(categoryId);
    const type = await this.productTypeRepository.deleteByIdForCategory(
      typeId,
      categoryId,
    );
    if (!type) throw new ProductTypeNotFoundError(typeId);
    return type;
  }

  private async requireById(categoryId: string): Promise<ProductCategory> {
    const category =
      await this.productCategoryRepository.findById(categoryId);
    if (!category) throw new ProductCategoryNotFoundError(categoryId);
    return category;
  }
}
