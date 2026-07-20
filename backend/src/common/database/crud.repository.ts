import {
  eq,
  inArray,
  type GetColumnData,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import type { AnyPgColumn, AnyPgTable } from 'drizzle-orm/pg-core';
import type { DatabaseService } from './database.service';

export abstract class RepositoryBase<
  TTable extends AnyPgTable,
  TIdColumn extends AnyPgColumn,
  TDomain,
> {
  protected constructor(
    protected readonly database: DatabaseService,
    protected readonly table: TTable,
    protected readonly idColumn: TIdColumn,
  ) {}

  protected abstract toDomain(row: InferSelectModel<TTable>): TDomain;

  async create(input: InferInsertModel<TTable>): Promise<TDomain> {
    const rows = (await this.database.db
      .insert(this.table as AnyPgTable)
      .values(input)
      .returning()) as unknown as InferSelectModel<TTable>[];
    const [row] = rows;
    if (row === undefined) {
      throw new Error('Created row was not returned by the database.');
    }
    return this.toDomain(row);
  }

  async createMany(inputs: InferInsertModel<TTable>[]): Promise<TDomain[]> {
    if (inputs.length === 0) return [];
    const rows = (await this.database.db
      .insert(this.table as AnyPgTable)
      .values(inputs)
      .returning()) as unknown as InferSelectModel<TTable>[];
    return rows.map((row) => this.toDomain(row));
  }
}

export abstract class CrudRepository<
  TTable extends AnyPgTable,
  TIdColumn extends AnyPgColumn,
  TDomain,
> extends RepositoryBase<TTable, TIdColumn, TDomain> {
  async findAll(): Promise<TDomain[]> {
    const rows = (await this.database.db
      .select()
      .from(this.table as AnyPgTable)) as unknown as InferSelectModel<TTable>[];
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: GetColumnData<TIdColumn>): Promise<TDomain | null> {
    const [row] = await this.database.db
      .select()
      .from(this.table as AnyPgTable)
      .where(eq(this.idColumn, id))
      .limit(1);
    return row === undefined
      ? null
      : this.toDomain(row as InferSelectModel<TTable>);
  }

  async updateById(
    id: GetColumnData<TIdColumn>,
    patch: Partial<InferInsertModel<TTable>>,
  ): Promise<TDomain | null> {
    const rows = (await this.database.db
      .update(this.table as AnyPgTable)
      .set(patch)
      .where(eq(this.idColumn, id))
      .returning()) as unknown as InferSelectModel<TTable>[];
    const [row] = rows;
    return row === undefined ? null : this.toDomain(row);
  }

  async deleteById(id: GetColumnData<TIdColumn>): Promise<TDomain | null> {
    const rows = (await this.database.db
      .delete(this.table as AnyPgTable)
      .where(eq(this.idColumn, id))
      .returning()) as unknown as InferSelectModel<TTable>[];
    const [row] = rows;
    return row === undefined ? null : this.toDomain(row);
  }

  async deleteMany(ids: GetColumnData<TIdColumn>[]): Promise<TDomain[]> {
    if (ids.length === 0) return [];
    const rows = (await this.database.db
      .delete(this.table as AnyPgTable)
      .where(inArray(this.idColumn, ids))
      .returning()) as unknown as InferSelectModel<TTable>[];
    return rows.map((row) => this.toDomain(row));
  }
}
