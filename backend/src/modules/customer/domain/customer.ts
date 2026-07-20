export const CustomerType = {
  Individual: 'individual',
  Company: 'company',
  Government: 'government',
} as const;
export type CustomerType = (typeof CustomerType)[keyof typeof CustomerType];

export const CountryCode = {
  Poland: 'pl',
  Norway: 'no',
} as const;
export type CountryCode = (typeof CountryCode)[keyof typeof CountryCode];

export class Customer {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly name: string,
    public readonly type: CustomerType,
    public readonly legalName: string | null,
    public readonly taxNumber: string | null,
    public readonly address: string | null,
    public readonly city: string | null,
    public readonly region: string | null,
    public readonly postalCode: string | null,
    public readonly country: CountryCode | null,
    public readonly notes: string | null,
  ) {}
}

export class Contact {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly name: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly description: string | null,
  ) {}
}
