import { Injectable, type OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Pool } from 'pg';
import type { TransactionManager } from '../application/transaction-manager';
import { relations } from './schemas/relations';

type Database = NodePgDatabase<typeof relations>;
type DatabaseTransaction = Parameters<Parameters<Database['transaction']>[0]>[0];
type DatabaseExecutor = Pick<
  Database,
  'delete' | 'insert' | 'select' | 'update'
>;

@Injectable()
export class DatabaseService
  implements OnApplicationShutdown, TransactionManager
{
  private readonly pool: Pool;
  private readonly rootDatabase: Database;
  private readonly transactionStorage =
    new AsyncLocalStorage<DatabaseTransaction>();

  constructor(config: ConfigService) {
    this.pool = new Pool({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
    });
    this.rootDatabase = drizzle({ client: this.pool, relations });
  }

  get db(): DatabaseExecutor {
    return this.transactionStorage.getStore() ?? this.rootDatabase;
  }

  runInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    if (this.transactionStorage.getStore()) return operation();

    return this.rootDatabase.transaction((transaction) =>
      this.transactionStorage.run(transaction, operation),
    );
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
