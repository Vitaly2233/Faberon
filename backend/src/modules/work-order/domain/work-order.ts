export const WorkOrderStage = {
  Waiting: 'waiting',
  Diagnostics: 'diagnostics',
  WaitingParts: 'waiting-parts',
  Repaired: 'repaired',
} as const;
export type WorkOrderStage =
  (typeof WorkOrderStage)[keyof typeof WorkOrderStage];

export class WorkOrder {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly customerId: string,
    public readonly productId: string | null,
    public readonly workerId: string | null,
    public readonly number: number,
    public readonly description: string,
    public readonly stage: WorkOrderStage,
    public readonly createdAt: Date,
    public readonly estimatedDate: string | null,
    public readonly showFinalPrice: boolean,
  ) {}
}

export class ExtraExpense {
  constructor(
    public readonly id: string,
    public readonly workOrderId: string,
    public readonly name: string,
    public readonly price: string,
    public readonly isHidden: boolean,
  ) {}
}

export class WorkOrderHistoryItem {
  constructor(
    public readonly id: string,
    public readonly workOrderId: string,
    public readonly workerId: string | null,
    public readonly text: string,
    public readonly createdAt: Date,
  ) {}
}
