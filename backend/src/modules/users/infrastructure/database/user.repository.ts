import { Injectable } from '@nestjs/common';
import type { InferSelectModel } from 'drizzle-orm';
import { DatabaseService } from '../../../../common/database/database.service';
import { users } from '../../../../common/database/schemas/user.schema';
import { TenantCrudRepository } from '../../../../common/database/tenant-crud.repository';
import { User } from '../../domain/user';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class UserRepository extends TenantCrudRepository<
  typeof users,
  typeof users.id,
  typeof users.companyId,
  User
> {
  constructor(database: DatabaseService) {
    super(database, users, users.id, users.companyId);
  }

  async findByEmail(companyId: string, email: string): Promise<User | null> {
    const [row] = await this.database.db
      .select()
      .from(users)
      .where(and(eq(users.companyId, companyId), eq(users.email, email)))
      .limit(1);

    return row === undefined ? null : this.toDomain(row);
  }

  protected toDomain(row: InferSelectModel<typeof users>): User {
    return new User(row.id, row.companyId, row.email, row.passwordHash);
  }
}
