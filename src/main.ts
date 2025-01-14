// Sentry Instrumentation
import * as Sentry from "@sentry/node";

// NestJS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProblemDetailsExceptionFilter } from './common';
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  Sentry.init({
    dsn: configService.get<string>("sentryDsn"),
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
  });
  
  Sentry.profiler.startProfiler();

  
  app.useGlobalFilters(new ProblemDetailsExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
