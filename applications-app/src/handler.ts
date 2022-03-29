import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { EnrollmentsService } from './applications/enrollments.service';
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

export async function schedulePacketReminders(event, context) {
  const app = await bootstrap();
  const enrollmentsService = app.get(EnrollmentsService);
  const data = await enrollmentsService.runScheduleReminders();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: data,
    }),
  };
}
