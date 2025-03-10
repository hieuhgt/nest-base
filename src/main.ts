import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import createLogger from "./config/winston.config";
import "./telemetry";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createLogger(),
  });
  await app.listen(3003);
}
bootstrap();
