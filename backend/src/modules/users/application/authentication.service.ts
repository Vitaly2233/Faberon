import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../common/application/transaction-manager';
import type { Company } from '../domain/company';
import type { User } from '../domain/user';
import { CompanyRepository } from '../infrastructure/database/company.repository';
import { UserRepository } from '../infrastructure/database/user.repository';
import { JwtAccessTokenService } from '../infrastructure/security/jwt-access-token.service';
import { ScryptPasswordHasher } from '../infrastructure/security/scrypt-password-hasher';
import { InvalidCredentialsError } from '../domain/user.errors';

export interface RegistrationResult {
  company: Company;
  user: User;
  accessToken: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: ScryptPasswordHasher,
    private readonly accessTokenService: JwtAccessTokenService,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async register(
    companyName: string,
    email: string,
    password: string,
  ): Promise<RegistrationResult> {
    const passwordHash = await this.passwordHasher.hash(password);

    return this.transactionManager.runInTransaction(async () => {
      const company = await this.companyRepository.create({
        name: companyName,
      });
      const user = await this.userRepository.create({
        companyId: company.id,
        email,
        passwordHash,
      });
      const accessToken = await this.accessTokenService.issue(user);

      return { company, user, accessToken };
    });
  }

  async login(
    companyId: string,
    email: string,
    password: string,
  ): Promise<string> {
    const user = await this.userRepository.findByEmail(companyId, email);
    if (!user) throw new InvalidCredentialsError();

    const passwordIsValid = await this.passwordHasher.verify(
      password,
      user?.passwordHash,
    );
    if (!passwordIsValid) throw new InvalidCredentialsError();

    return this.accessTokenService.issue(user);
  }
}
