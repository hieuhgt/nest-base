import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KafkaModule } from "./kafka/kafka.module";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [KafkaModule],
})
export class AppModule {}
