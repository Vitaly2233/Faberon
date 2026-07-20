import { Injectable } from '@nestjs/common';
import { and, desc, eq, max, type InferSelectModel } from 'drizzle-orm';
import { DatabaseService } from '../../../../common/database/database.service';
import { workOrders } from '../../../../common/database/schemas/work-order.schema';
import { TenantCrudRepository } from '../../../../common/database/tenant-crud.repository';
import { WorkOrder } from '../../domain/work-order';

@Injectable()
export class WorkOrderRepository extends TenantCrudRepository<
  typeof workOrders,
  typeof workOrders.id,
  typeof workOrders.companyId,
  WorkOrder
> {
  constructor(database: DatabaseService) {
    super(database, workOrders, workOrders.id, workOrders.companyId);
  }

  async findAllByCustomerId(
    companyId: string,
    customerId: string,
  ): Promise<WorkOrder[]> {
    const rows = await this.database.db
      .select()
      .from(workOrders)
      .where(
        and(
          eq(workOrders.customerId, customerId),
          eq(workOrders.companyId, companyId),
        ),
      )
      .orderBy(desc(workOrders.createdAt));
    return rows.map((row) => this.toDomain(row));
  }

  override async findAll(companyId: string): Promise<WorkOrder[]> {
    const rows = await this.database.db
      .select()
      .from(workOrders)
      .where(eq(workOrders.companyId, companyId))
      .orderBy(desc(workOrders.createdAt));
    return rows.map((row) => this.toDomain(row));
  }

  async nextNumber(companyId: string): Promise<number> {
    const [row] = await this.database.db
      .select({ value: max(workOrders.number) })
      .from(workOrders)
      .where(eq(workOrders.companyId, companyId));
    return (row?.value ?? 1000) + 1;
  }

  protected toDomain(row: InferSelectModel<typeof workOrders>): WorkOrder {
    return new WorkOrder(
      row.id,
      row.companyId,
      row.customerId,
      row.productId,
      row.workerId,
      row.number,
      row.description,
      row.stage,
      row.createdAt,
      row.estimatedDate,
      row.showFinalPrice,
    );
  }
}
