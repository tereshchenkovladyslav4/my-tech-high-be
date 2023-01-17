import { RoleGraphqlModule } from './role/role.module';
import { AuthGraphqlModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersGraphqlModule } from './users/users.module';

@Module({
  imports: [UsersGraphqlModule, AuthGraphqlModule, RoleGraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
