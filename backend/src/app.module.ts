import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { DatabaseModule } from './common/database/database.module';
import { RabbitMqModule } from './common/rabbitmq/rabbitmq.module';
import { CustomerModule } from './modules/customer/customer.module';

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
