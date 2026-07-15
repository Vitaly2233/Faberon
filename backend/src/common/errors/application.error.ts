export abstract class ApplicationError extends Error {
  protected constructor(
    message: string,
    readonly statusCode: number,
    readonly error: string,
  ) {
    super(message);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404, 'Not Found');
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, 409, 'Conflict');
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super(message, 401, 'Unauthorized');
  }
}
