import { Injectable } from '@nestjs/common';
import { CustomerService } from '../../customer/application/customer.service';
import type { Product } from '../domain/product';
import {
  ProductNotFoundError,
  ProductTypeNotFoundError,
} from '../domain/product.errors';
import { ProductRepository } from '../infrastructure/database/product.repository';
import { ProductTypeRepository } from '../infrastructure/database/product-type.repository';
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from '../presentation/http/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productTypeRepository: ProductTypeRepository,
    private readonly customerService: CustomerService,
  ) {}

  async create(
    companyId: string,
    input: CreateProductRequest,
  ): Promise<Product> {
    await Promise.all([
      this.customerService.requireById(companyId, input.customerId),
      this.requireType(input.typeId),
    ]);

    return this.productRepository.create({
      companyId,
      customerId: input.customerId,
      typeId: input.typeId,
      manufacturer: input.manufacturer,
      model: input.model,
      serialNumber: input.serialNumber,
      address: input.address ?? null,
      contactName: input.contactName ?? null,
      warrantyDate: input.warrantyDate ?? null,
      ownership: input.ownership,
    });
  }

  async findAll(
    companyId: string,
    customerId?: string,
  ): Promise<Product[]> {
    if (customerId) {
      await this.customerService.requireById(companyId, customerId);
      return this.productRepository.findAllByCustomerId(companyId, customerId);
    }
    return this.productRepository.findAll(companyId);
  }

  async findById(companyId: string, productId: string): Promise<Product> {
    const product = await this.productRepository.findById(
      companyId,
      productId,
    );
    if (!product) throw new ProductNotFoundError(productId);
    return product;
  }

  async update(
    companyId: string,
    productId: string,
    input: UpdateProductRequest,
  ): Promise<Product> {
    if (input.customerId !== undefined) {
      await this.customerService.requireById(companyId, input.customerId);
    }
    if (input.typeId !== undefined) {
      await this.requireType(input.typeId);
    }

    const product = await this.productRepository.updateById(
      companyId,
      productId,
      input,
    );
    if (!product) throw new ProductNotFoundError(productId);
    return product;
  }

  async delete(companyId: string, productId: string): Promise<Product> {
    const product = await this.productRepository.deleteById(
      companyId,
      productId,
    );
    if (!product) throw new ProductNotFoundError(productId);
    return product;
  }

  private async requireType(typeId: string): Promise<void> {
    const type = await this.productTypeRepository.findById(typeId);
    if (!type) throw new ProductTypeNotFoundError(typeId);
  }
}
