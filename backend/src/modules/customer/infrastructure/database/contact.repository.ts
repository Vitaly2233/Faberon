import { Injectable } from '@nestjs/common';
import {
  eq,
  inArray,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { contacts } from '../../../../common/database/schemas/contact.schema';
import { isUniqueViolation } from '../../../../common/utils/database-error.util';
import { Contact } from '../../domain/customer';
import { CustomerDetailsAlreadyExistError } from '../../domain/customer.errors';

@Injectable()
export class ContactRepository extends CrudRepository<
  typeof contacts,
  typeof contacts.id,
  Contact
> {
  constructor(database: DatabaseService) {
    super(database, contacts, contacts.id);
  }

  async findByCustomerId(customerId: string): Promise<Contact | null> {
    const [row] = await this.database.db
      .select()
      .from(contacts)
      .where(eq(contacts.customerId, customerId))
      .limit(1);
    return row === undefined ? null : this.toDomain(row);
  }

  async findByCustomerIds(customerIds: string[]): Promise<Contact[]> {
    if (customerIds.length === 0) {
      return [];
    }

    const rows = await this.database.db
      .select()
      .from(contacts)
      .where(inArray(contacts.customerId, customerIds));

    return rows.map((row) => this.toDomain(row));
  }

  override async create(
    contact: InferInsertModel<typeof contacts>,
  ): Promise<Contact> {
    try {
      return await super.create(contact);
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new CustomerDetailsAlreadyExistError('contact');
      }
      throw error;
    }
  }

  protected toDomain(row: InferSelectModel<typeof contacts>): Contact {
    return new Contact(
      row.id,
      row.customerId,
      row.name,
      row.email,
      row.phone,
      row.description,
    );
  }
}
