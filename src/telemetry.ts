import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import * as api from "@opentelemetry/api-logs";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { Resource } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const logExporter = new OTLPLogExporter({
  url: "http://localhost:4318/v1/logs", // Send logs to OTel collector
});

const loggerProvider = new LoggerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "nest-base",
  }),
});

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
api.logs.setGlobalLoggerProvider(loggerProvider);

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new NestInstrumentation(),
    new WinstonInstrumentation(),
  ],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "nest-base",
  }),
});

sdk.start();
// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});

export default sdk;
