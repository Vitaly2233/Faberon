import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../common/application/transaction-manager';
import { CustomerService } from '../../customer/application/customer.service';
import { ProductService } from '../../product/application/product.service';
import { ProductNotFoundError } from '../../product/domain/product.errors';
import type {
  ExtraExpense,
  WorkOrder,
  WorkOrderHistoryItem,
} from '../domain/work-order';
import { WorkOrderStage } from '../domain/work-order';
import {
  ExtraExpenseNotFoundError,
  WorkOrderNotFoundError,
} from '../domain/work-order.errors';
import { ExtraExpenseRepository } from '../infrastructure/database/extra-expense.repository';
import { WorkOrderHistoryItemRepository } from '../infrastructure/database/work-order-history-item.repository';
import { WorkOrderRepository } from '../infrastructure/database/work-order.repository';
import type {
  CreateExtraExpenseRequest,
  CreateWorkOrderHistoryRequest,
  CreateWorkOrderRequest,
  UpdateExtraExpenseRequest,
  UpdateWorkOrderRequest,
} from '../presentation/http/work-order.dto';

@Injectable()
export class WorkOrderService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly extraExpenseRepository: ExtraExpenseRepository,
    private readonly historyItemRepository: WorkOrderHistoryItemRepository,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async create(
    companyId: string,
    workerId: string,
    input: CreateWorkOrderRequest,
  ): Promise<WorkOrder> {
    await this.customerService.requireById(companyId, input.customerId);
    await this.requireProductForCustomer(
      companyId,
      input.customerId,
      input.productId,
    );

    return this.transactionManager.runInTransaction(async () => {
      const number = await this.workOrderRepository.nextNumber(companyId);
      const workOrder = await this.workOrderRepository.create({
        companyId,
        customerId: input.customerId,
        productId: input.productId ?? null,
        workerId: input.workerId ?? workerId,
        number,
        description: input.description,
        stage: WorkOrderStage.Waiting,
        estimatedDate: input.estimatedDate ?? null,
        showFinalPrice: input.showFinalPrice ?? false,
      });

      await this.historyItemRepository.create({
        workOrderId: workOrder.id,
        workerId,
        text: 'Work order created.',
      });

      return workOrder;
    });
  }

  async findAll(
    companyId: string,
    customerId?: string,
  ): Promise<WorkOrder[]> {
    if (customerId) {
      await this.customerService.requireById(companyId, customerId);
      return this.workOrderRepository.findAllByCustomerId(
        companyId,
        customerId,
      );
    }
    return this.workOrderRepository.findAll(companyId);
  }

  async findById(companyId: string, workOrderId: string): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(
      companyId,
      workOrderId,
    );
    if (!workOrder) throw new WorkOrderNotFoundError(workOrderId);
    return workOrder;
  }

  async update(
    companyId: string,
    workOrderId: string,
    input: UpdateWorkOrderRequest,
  ): Promise<WorkOrder> {
    const existing = await this.findById(companyId, workOrderId);
    const customerId = input.customerId ?? existing.customerId;
    const productId =
      input.productId !== undefined ? input.productId : existing.productId;

    if (input.customerId !== undefined) {
      await this.customerService.requireById(companyId, input.customerId);
    }
    await this.requireProductForCustomer(companyId, customerId, productId);

    const workOrder = await this.workOrderRepository.updateById(
      companyId,
      workOrderId,
      input,
    );
    if (!workOrder) throw new WorkOrderNotFoundError(workOrderId);
    return workOrder;
  }

  async delete(companyId: string, workOrderId: string): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.deleteById(
      companyId,
      workOrderId,
    );
    if (!workOrder) throw new WorkOrderNotFoundError(workOrderId);
    return workOrder;
  }

  async createExtraExpense(
    companyId: string,
    workOrderId: string,
    input: CreateExtraExpenseRequest,
  ): Promise<ExtraExpense> {
    await this.findById(companyId, workOrderId);
    return this.extraExpenseRepository.create({
      workOrderId,
      name: input.name,
      price: input.price,
      isHidden: input.isHidden ?? false,
    });
  }

  async findAllExtraExpenses(
    companyId: string,
    workOrderId: string,
  ): Promise<ExtraExpense[]> {
    await this.findById(companyId, workOrderId);
    return this.extraExpenseRepository.findAllByWorkOrderId(workOrderId);
  }

  async findExtraExpenseById(
    companyId: string,
    workOrderId: string,
    extraExpenseId: string,
  ): Promise<ExtraExpense> {
    await this.findById(companyId, workOrderId);
    const item = await this.extraExpenseRepository.findByIdForWorkOrder(
      extraExpenseId,
      workOrderId,
    );
    if (!item) throw new ExtraExpenseNotFoundError(extraExpenseId);
    return item;
  }

  async updateExtraExpense(
    companyId: string,
    workOrderId: string,
    extraExpenseId: string,
    input: UpdateExtraExpenseRequest,
  ): Promise<ExtraExpense> {
    await this.findById(companyId, workOrderId);
    const existing = await this.extraExpenseRepository.findByIdForWorkOrder(
      extraExpenseId,
      workOrderId,
    );
    if (!existing) throw new ExtraExpenseNotFoundError(extraExpenseId);
    const updated = await this.extraExpenseRepository.updateById(
      extraExpenseId,
      input,
    );
    if (!updated) throw new ExtraExpenseNotFoundError(extraExpenseId);
    return updated;
  }

  async deleteExtraExpense(
    companyId: string,
    workOrderId: string,
    extraExpenseId: string,
  ): Promise<ExtraExpense> {
    await this.findById(companyId, workOrderId);
    const existing = await this.extraExpenseRepository.findByIdForWorkOrder(
      extraExpenseId,
      workOrderId,
    );
    if (!existing) throw new ExtraExpenseNotFoundError(extraExpenseId);
    const deleted =
      await this.extraExpenseRepository.deleteById(extraExpenseId);
    if (!deleted) throw new ExtraExpenseNotFoundError(extraExpenseId);
    return deleted;
  }

  async createHistory(
    companyId: string,
    workOrderId: string,
    workerId: string,
    input: CreateWorkOrderHistoryRequest,
  ): Promise<WorkOrderHistoryItem> {
    await this.findById(companyId, workOrderId);
    return this.historyItemRepository.create({
      workOrderId,
      workerId,
      text: input.text,
    });
  }

  async findAllHistory(
    companyId: string,
    workOrderId: string,
  ): Promise<WorkOrderHistoryItem[]> {
    await this.findById(companyId, workOrderId);
    return this.historyItemRepository.findAllByWorkOrderId(workOrderId);
  }

  private async requireProductForCustomer(
    companyId: string,
    customerId: string,
    productId: string | null | undefined,
  ): Promise<void> {
    if (!productId) return;
    const product = await this.productService.findById(companyId, productId);
    if (product.customerId !== customerId) {
      throw new ProductNotFoundError(productId);
    }
  }
}
