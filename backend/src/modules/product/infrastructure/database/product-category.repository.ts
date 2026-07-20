import { Injectable } from '@nestjs/common';
import type { InferSelectModel } from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { productCategories } from '../../../../common/database/schemas/product-category.schema';
import { ProductCategory } from '../../domain/product';

@Injectable()
export class ProductCategoryRepository extends CrudRepository<
  typeof productCategories,
  typeof productCategories.id,
  ProductCategory
> {
  constructor(database: DatabaseService) {
    super(database, productCategories, productCategories.id);
  }

  protected toDomain(
    row: InferSelectModel<typeof productCategories>,
  ): ProductCategory {
    return new ProductCategory(row.id, row.name);
  }
}
