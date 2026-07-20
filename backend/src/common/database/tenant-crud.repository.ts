import {
  and,
  eq,
  inArray,
  type GetColumnData,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import type { AnyPgColumn, AnyPgTable } from 'drizzle-orm/pg-core';
import { RepositoryBase } from './crud.repository';
import type { DatabaseService } from './database.service';

export abstract class TenantCrudRepository<
  TTable extends AnyPgTable,
  TIdColumn extends AnyPgColumn,
  TCompanyIdColumn extends AnyPgColumn,
  TDomain,
> extends RepositoryBase<TTable, TIdColumn, TDomain> {
  protected constructor(
    database: DatabaseService,
    table: TTable,
    idColumn: TIdColumn,
    protected readonly companyIdColumn: TCompanyIdColumn,
  ) {
    super(database, table, idColumn);
  }

  async findAll(
    companyId: GetColumnData<TCompanyIdColumn>,
  ): Promise<TDomain[]> {
    const rows = (await this.database.db
      .select()
      .from(this.table as AnyPgTable)
      .where(
        eq(this.companyIdColumn, companyId),
      )) as unknown as InferSelectModel<TTable>[];
    return rows.map((row) => this.toDomain(row));
  }

  async findById(
    companyId: GetColumnData<TCompanyIdColumn>,
    id: GetColumnData<TIdColumn>,
  ): Promise<TDomain | null> {
    const [row] = await this.database.db
      .select()
      .from(this.table as AnyPgTable)
      .where(and(eq(this.idColumn, id), eq(this.companyIdColumn, companyId)))
      .limit(1);
    return row === undefined
      ? null
      : this.toDomain(row as InferSelectModel<TTable>);
  }

  async updateById(
    companyId: GetColumnData<TCompanyIdColumn>,
    id: GetColumnData<TIdColumn>,
    patch: Partial<InferInsertModel<TTable>>,
  ): Promise<TDomain | null> {
    const rows = (await this.database.db
      .update(this.table as AnyPgTable)
      .set(patch)
      .where(and(eq(this.idColumn, id), eq(this.companyIdColumn, companyId)))
      .returning()) as unknown as InferSelectModel<TTable>[];
    const [row] = rows;
    return row === undefined ? null : this.toDomain(row);
  }

  async deleteById(
    companyId: GetColumnData<TCompanyIdColumn>,
    id: GetColumnData<TIdColumn>,
  ): Promise<TDomain | null> {
    const rows = (await this.database.db
      .delete(this.table as AnyPgTable)
      .where(and(eq(this.idColumn, id), eq(this.companyIdColumn, companyId)))
      .returning()) as unknown as InferSelectModel<TTable>[];
    const [row] = rows;
    return row === undefined ? null : this.toDomain(row);
  }

  async deleteMany(
    companyId: GetColumnData<TCompanyIdColumn>,
    ids: GetColumnData<TIdColumn>[],
  ): Promise<TDomain[]> {
    if (ids.length === 0) return [];
    const rows = (await this.database.db
      .delete(this.table as AnyPgTable)
      .where(
        and(inArray(this.idColumn, ids), eq(this.companyIdColumn, companyId)),
      )
      .returning()) as unknown as InferSelectModel<TTable>[];
    return rows.map((row) => this.toDomain(row));
  }
}
