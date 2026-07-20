import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { ProductCategoryService } from './application/product-category.service';
import { ProductService } from './application/product.service';
import { ProductCategoryRepository } from './infrastructure/database/product-category.repository';
import { ProductTypeRepository } from './infrastructure/database/product-type.repository';
import { ProductRepository } from './infrastructure/database/product.repository';
import { ProductCategoryController } from './presentation/http/product-category.controller';
import { ProductController } from './presentation/http/product.controller';

@Module({
  imports: [CustomerModule],
  controllers: [ProductController, ProductCategoryController],
  providers: [
    ProductRepository,
    ProductCategoryRepository,
    ProductTypeRepository,
    ProductService,
    ProductCategoryService,
  ],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
