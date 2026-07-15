import { Injectable } from '@nestjs/common';
import type { InferSelectModel } from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { companies } from '../../../../common/database/schemas/company.schema';
import { Company } from '../../domain/company';

@Injectable()
export class CompanyRepository extends CrudRepository<
  typeof companies,
  typeof companies.id,
  Company
> {
  constructor(database: DatabaseService) {
    super(database, companies, companies.id);
  }

  protected toDomain(row: InferSelectModel<typeof companies>): Company {
    return new Company(row.id, row.name);
  }
}
