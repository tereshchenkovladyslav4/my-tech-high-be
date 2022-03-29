import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsGraphqlModule } from './students/students.module';

@Module({
  imports: [StudentsGraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
