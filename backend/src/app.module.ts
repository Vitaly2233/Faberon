import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';

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
      }),
    }),
    DatabaseModule,
    CustomerModule,
    RabbitMqModule,
  ],
})
export class AppModule {}
