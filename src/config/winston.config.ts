import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

export default function createLogger() {
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({
          message: true,
          level: true,
          colors: {
            info: "green",
            error: "red",
          },
        }),
        winston.format.splat(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
          (log) =>
            `[${log.timestamp}] [${log.context}] [${log.level}] ${
              log.stack || log.message
            }`,
        ),
      ),
    }),
    new OpenTelemetryTransportV3(),
    new DailyRotateFile({
      level: "error",
      filename: "./src/logs/error/error.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ];

  const logger = WinstonModule.createLogger({
    defaultMeta: { environment: process.env.NODE_ENV },
    transports,
  });

  return logger;
}
