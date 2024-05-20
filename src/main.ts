  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import * as cookieParser from 'cookie-parser';

  async function bootstrap() {
    try {
      const app = await NestFactory.create(AppModule);
      app.use(cookieParser());
      app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
      });

      await app.listen(8000);
      console.log('Application is running on: http://localhost:8000');
    } catch (error) {
      console.error('Error during application bootstrap', error);
    }
  }
  bootstrap();
