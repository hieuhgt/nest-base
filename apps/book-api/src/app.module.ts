import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Logger } from "winston";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === "production" ? ".env" : ".env.local",
      ],
      isGlobal: true,
      cache: true, // Optional: Cache env variables for performance
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
