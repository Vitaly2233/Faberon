import { NotFoundError } from '../../../common/errors/application.error';

export class WorkOrderNotFoundError extends NotFoundError {
  constructor(workOrderId: string) {
    super(`Work order ${workOrderId} was not found.`);
  }
}

export class ExtraExpenseNotFoundError extends NotFoundError {
  constructor(extraExpenseId: string) {
    super(`Extra expense ${extraExpenseId} was not found.`);
  }
}
