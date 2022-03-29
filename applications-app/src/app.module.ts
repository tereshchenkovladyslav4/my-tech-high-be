import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsGraphqlModule } from './applications/applications.module';

@Module({
  imports: [ApplicationsGraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
