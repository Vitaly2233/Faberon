import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import Joi from 'joi';
import { DatabaseModule } from './common/database/database.module';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter';
import { RabbitMqModule } from './common/rabbitmq/rabbitmq.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ProductModule } from './modules/product/product.module';
import { UsersModule } from './modules/users/users.module';
import { WorkOrderModule } from './modules/work-order/work-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
        RABBITMQ_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    CustomerModule,
    ProductModule,
    WorkOrderModule,
    RabbitMqModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
