export class User {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly email: string,
    public readonly passwordHash: string,
  ) {}
}
