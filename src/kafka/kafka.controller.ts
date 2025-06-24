import { Body, Controller, Post } from "@nestjs/common";
import { ProducerService } from "./producer/producer.service";

@Controller("kafka")
export class KafkaController {
  constructor(private readonly producerService: ProducerService) {}

  @Post("send")
  async sendMessage(@Body() message: any) {
    await this.producerService.send("my-topic", message);
    return { status: "Message sent to Redpanda", message };
  }
}
