import { UnauthorizedError } from '../../../common/errors/application.error';

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Invalid company, email, or password.');
  }
}
