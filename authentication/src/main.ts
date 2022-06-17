import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3003);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('>>>>>Authentication is running in port 3003')
}
bootstrap();
