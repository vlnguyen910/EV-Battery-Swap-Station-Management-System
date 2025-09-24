import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép fields trong DTO
      forbidNonWhitelisted: true, // Reject extra fields
      transform: true, // Auto transform types
      disableErrorMessages: false, // Show validation errors
    }),
  );

  // Enable cookie parsing
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
