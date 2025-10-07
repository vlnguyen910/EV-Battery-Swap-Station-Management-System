import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], // Vite dev server ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

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
bootstrap().catch((error) => console.error('Bootstrap error:', error));
