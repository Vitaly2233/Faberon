import { Injectable } from '@nestjs/common';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { extraExpenses } from '../../../../common/database/schemas/extra-expense.schema';
import { ExtraExpense } from '../../domain/work-order';

@Injectable()
export class ExtraExpenseRepository extends CrudRepository<
  typeof extraExpenses,
  typeof extraExpenses.id,
  ExtraExpense
> {
  constructor(database: DatabaseService) {
    super(database, extraExpenses, extraExpenses.id);
  }

  async findAllByWorkOrderId(workOrderId: string): Promise<ExtraExpense[]> {
    const rows = await this.database.db
      .select()
      .from(extraExpenses)
      .where(eq(extraExpenses.workOrderId, workOrderId));
    return rows.map((row) => this.toDomain(row));
  }

  async findByIdForWorkOrder(
    id: string,
    workOrderId: string,
  ): Promise<ExtraExpense | null> {
    const [row] = await this.database.db
      .select()
      .from(extraExpenses)
      .where(
        and(
          eq(extraExpenses.id, id),
          eq(extraExpenses.workOrderId, workOrderId),
        ),
      )
      .limit(1);
    return row === undefined ? null : this.toDomain(row);
  }

  protected toDomain(
    row: InferSelectModel<typeof extraExpenses>,
  ): ExtraExpense {
    return new ExtraExpense(
      row.id,
      row.workOrderId,
      row.name,
      row.price,
      row.isHidden,
    );
  }
}
