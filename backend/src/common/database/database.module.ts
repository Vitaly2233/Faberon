import { Global, Module } from '@nestjs/common';
import { TRANSACTION_MANAGER } from '../application/transaction-manager';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    { provide: TRANSACTION_MANAGER, useExisting: DatabaseService },
  ],
  exports: [DatabaseService, TRANSACTION_MANAGER],
})
export class DatabaseModule {}
