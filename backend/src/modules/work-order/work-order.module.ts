import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { WorkOrderService } from './application/work-order.service';
import { ExtraExpenseRepository } from './infrastructure/database/extra-expense.repository';
import { WorkOrderHistoryItemRepository } from './infrastructure/database/work-order-history-item.repository';
import { WorkOrderRepository } from './infrastructure/database/work-order.repository';
import { WorkOrderController } from './presentation/http/work-order.controller';

@Module({
  imports: [CustomerModule, ProductModule],
  controllers: [WorkOrderController],
  providers: [
    WorkOrderRepository,
    ExtraExpenseRepository,
    WorkOrderHistoryItemRepository,
    WorkOrderService,
  ],
})
export class WorkOrderModule {}
