import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Consumer, Kafka } from "kafkajs";

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "my-app-consumer",
      brokers: ["localhost:9092"],
    });
    this.consumer = this.kafka.consumer({ groupId: "my-group" });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "my-topic", fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value?.toString(),
        });
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
