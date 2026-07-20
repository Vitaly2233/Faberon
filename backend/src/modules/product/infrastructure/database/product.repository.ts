import { Injectable } from '@nestjs/common';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import { DatabaseService } from '../../../../common/database/database.service';
import { products } from '../../../../common/database/schemas/product.schema';
import { TenantCrudRepository } from '../../../../common/database/tenant-crud.repository';
import { Product } from '../../domain/product';

@Injectable()
export class ProductRepository extends TenantCrudRepository<
  typeof products,
  typeof products.id,
  typeof products.companyId,
  Product
> {
  constructor(database: DatabaseService) {
    super(database, products, products.id, products.companyId);
  }

  async findAllByCustomerId(
    companyId: string,
    customerId: string,
  ): Promise<Product[]> {
    const rows = await this.database.db
      .select()
      .from(products)
      .where(
        and(
          eq(products.customerId, customerId),
          eq(products.companyId, companyId),
        ),
      );
    return rows.map((row) => this.toDomain(row));
  }

  protected toDomain(row: InferSelectModel<typeof products>): Product {
    return new Product(
      row.id,
      row.companyId,
      row.customerId,
      row.typeId,
      row.manufacturer,
      row.model,
      row.serialNumber,
      row.address,
      row.contactName,
      row.warrantyDate,
      row.ownership,
    );
  }
}
