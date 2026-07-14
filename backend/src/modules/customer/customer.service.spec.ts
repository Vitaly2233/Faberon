import { describe, expect, it, jest } from '@jest/globals';
import type { Customer } from './customer.domain';
import { CustomerRepository } from './customer.repository';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  it('creates a customer through the repository', async () => {
    const customer: Customer = {
      id: '167c66e7-503c-46a7-8c53-fc7e46b8aca8',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: new Date('2026-07-14T12:00:00.000Z'),
    };
    const repository = {
      create: jest.fn<CustomerRepository['create']>().mockResolvedValue(customer),
    } as unknown as CustomerRepository;
    const service = new CustomerService(repository);

    await expect(service.create(customer.name, customer.email)).resolves.toBe(
      customer,
    );
    expect(repository.create).toHaveBeenCalledWith({
      id: expect.any(String),
      name: customer.name,
      email: customer.email,
      createdAt: expect.any(Date),
    });
  });
});
