import { BadRequestException, Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  private logger: Logger = new Logger(AppController.name, { timestamp: true });

  constructor(private readonly appService: AppService) {}

  @Get()
  checkLog(): string {
    this.logger.log("random log");
    return this.appService.getHello();
  }

  @Get("/view-trace")
  viewTrace(): string {
    throw new BadRequestException("ERROR");
  }
}
