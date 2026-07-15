import { Injectable } from '@nestjs/common';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { users } from '../../../../common/database/schemas/user.schema';
import { User } from '../../domain/user';

@Injectable()
export class UserRepository extends CrudRepository<
  typeof users,
  typeof users.id,
  User
> {
  constructor(database: DatabaseService) {
    super(database, users, users.id);
  }

  async findByCompanyAndEmail(
    companyId: string,
    email: string,
  ): Promise<User | null> {
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
