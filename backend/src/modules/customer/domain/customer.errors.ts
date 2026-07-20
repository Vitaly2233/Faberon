import {
  ConflictError,
  NotFoundError,
} from '../../../common/errors/application.error';

export class CustomerNotFoundError extends NotFoundError {
  constructor(customerId: string) {
    super(`Customer ${customerId} was not found.`);
  }
}

export class CustomerDetailsAlreadyExistError extends ConflictError {
  constructor(details: 'contact') {
    super(`Customer ${details} already exists.`);
  }
}

export class ContactNotFoundError extends NotFoundError {
  constructor(customerId: string) {
    super(`Contact for customer ${customerId} was not found.`);
  }
}
