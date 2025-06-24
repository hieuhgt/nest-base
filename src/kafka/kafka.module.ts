import { Module } from "@nestjs/common";
import { ConsumerService } from "./consumer/consumer.service";
import { KafkaController } from "./kafka.controller";
import { ProducerService } from "./producer/producer.service";

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
  controllers: [KafkaController],
})
export class KafkaModule {}
