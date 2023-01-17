/* eslint-disable @typescript-eslint/no-unused-vars*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  return app;
}

export async function handler(event, context) {
  const app = await bootstrap();
  const appService = app.get(AppService);
  const data = appService.getHello();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: data,
    }),
  };
}
