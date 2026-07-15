export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface TransactionManager {
  runInTransaction<T>(operation: () => Promise<T>): Promise<T>;
}
