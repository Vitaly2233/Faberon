import {
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, type ChannelModel } from 'amqplib';

@Injectable()
export class RabbitMqService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(RabbitMqService.name);
  private connection: ChannelModel | null = null;

  constructor(private readonly config: ConfigService) {}

  async onApplicationBootstrap(): Promise<void> {
    this.connection = await connect(
      this.config.getOrThrow<string>('RABBITMQ_URL'),
    );
    this.logger.log('RabbitMQ connection initialized');
  }

  async onApplicationShutdown(): Promise<void> {
    await this.connection?.close();
  }
}
