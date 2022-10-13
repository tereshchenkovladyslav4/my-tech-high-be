import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../models/role.entity';
import { RoleService } from './services/role-service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  exports: [RoleService],
})
class RoleRepoModule {}
export default RoleRepoModule;
