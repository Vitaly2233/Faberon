import { NotFoundError } from '../../../common/errors/application.error';

export class ProductNotFoundError extends NotFoundError {
  constructor(productId: string) {
    super(`Product ${productId} was not found.`);
  }
}

export class ProductCategoryNotFoundError extends NotFoundError {
  constructor(categoryId: string) {
    super(`Product category ${categoryId} was not found.`);
  }
}

export class ProductTypeNotFoundError extends NotFoundError {
  constructor(typeId: string) {
    super(`Product type ${typeId} was not found.`);
  }
}
