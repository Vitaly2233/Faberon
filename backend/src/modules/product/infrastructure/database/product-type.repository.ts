import { Injectable } from '@nestjs/common';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { productTypes } from '../../../../common/database/schemas/product-type.schema';
import { ProductType } from '../../domain/product';

@Injectable()
export class ProductTypeRepository extends CrudRepository<
  typeof productTypes,
  typeof productTypes.id,
  ProductType
> {
  constructor(database: DatabaseService) {
    super(database, productTypes, productTypes.id);
  }

  async findAllByCategoryId(categoryId: string): Promise<ProductType[]> {
    const rows = await this.database.db
      .select()
      .from(productTypes)
      .where(eq(productTypes.categoryId, categoryId));
    return rows.map((row) => this.toDomain(row));
  }

  async findByIdForCategory(
    id: string,
    categoryId: string,
  ): Promise<ProductType | null> {
    const [row] = await this.database.db
      .select()
      .from(productTypes)
      .where(and(eq(productTypes.id, id), eq(productTypes.categoryId, categoryId)))
      .limit(1);
    return row === undefined ? null : this.toDomain(row);
  }

  async updateByIdForCategory(
    id: string,
    categoryId: string,
    patch: { name: string },
  ): Promise<ProductType | null> {
    const rows = await this.database.db
      .update(productTypes)
      .set(patch)
      .where(and(eq(productTypes.id, id), eq(productTypes.categoryId, categoryId)))
      .returning();
    const [row] = rows;
    return row === undefined ? null : this.toDomain(row);
  }

  async deleteByIdForCategory(
    id: string,
    categoryId: string,
  ): Promise<ProductType | null> {
    const rows = await this.database.db
      .delete(productTypes)
      .where(and(eq(productTypes.id, id), eq(productTypes.categoryId, categoryId)))
      .returning();
    const [row] = rows;
    return row === undefined ? null : this.toDomain(row);
  }

  protected toDomain(row: InferSelectModel<typeof productTypes>): ProductType {
    return new ProductType(row.id, row.categoryId, row.name);
  }
}
