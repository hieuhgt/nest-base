import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import { env } from "src/configs/env.config";

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger = new Logger(ProducerService.name);

  constructor() {
    this.kafka = new Kafka({
      clientId: env.KAFKA.KAFKA_CLIENT_ID,
      brokers: [env.KAFKA.KAFKA_BROKER],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(topic: string, data: any) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
      });
      this.logger.debug(`Sent to topic ${topic}`);
    } catch (err) {
      this.logger.error("Kafka send error", err);
    }
  }
}
