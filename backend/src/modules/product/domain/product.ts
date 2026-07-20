export const ProductOwnership = {
  ByClient: 'by_client',
  Rented: 'rented',
} as const;
export type ProductOwnership =
  (typeof ProductOwnership)[keyof typeof ProductOwnership];

export class Product {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly customerId: string,
    public readonly typeId: string,
    public readonly manufacturer: string,
    public readonly model: string,
    public readonly serialNumber: string,
    public readonly address: string | null,
    public readonly contactName: string | null,
    public readonly warrantyDate: string | null,
    public readonly ownership: ProductOwnership,
  ) {}
}

export class ProductCategory {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}

export class ProductType {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly name: string,
  ) {}
}
