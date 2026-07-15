import type { Customer } from '../domain/customer';

export interface CustomerContext {
  readonly customer?: Customer;
}
