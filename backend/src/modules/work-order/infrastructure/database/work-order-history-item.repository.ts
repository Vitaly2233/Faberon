import { Injectable } from '@nestjs/common';
import { desc, eq, type InferSelectModel } from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { workOrderHistoryItems } from '../../../../common/database/schemas/work-order-history-item.schema';
import { WorkOrderHistoryItem } from '../../domain/work-order';

@Injectable()
export class WorkOrderHistoryItemRepository extends CrudRepository<
  typeof workOrderHistoryItems,
  typeof workOrderHistoryItems.id,
  WorkOrderHistoryItem
> {
  constructor(database: DatabaseService) {
    super(database, workOrderHistoryItems, workOrderHistoryItems.id);
  }

  async findAllByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderHistoryItem[]> {
    const rows = await this.database.db
      .select()
      .from(workOrderHistoryItems)
      .where(eq(workOrderHistoryItems.workOrderId, workOrderId))
      .orderBy(desc(workOrderHistoryItems.createdAt));
    return rows.map((row) => this.toDomain(row));
  }

  protected toDomain(
    row: InferSelectModel<typeof workOrderHistoryItems>,
  ): WorkOrderHistoryItem {
    return new WorkOrderHistoryItem(
      row.id,
      row.workOrderId,
      row.workerId,
      row.text,
      row.createdAt,
    );
  }
}
