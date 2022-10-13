import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './services/s3.services';
import { FilesService } from './services/files.services';
import { UsersService } from './services/users.services';
import { SchoolYearService } from './services/schoolyear.service';
import { File } from './models/file.entity';
import { User } from './models/user.entity';
import { SchoolYear } from './models/schoolyear.entity';

const servicesImports = [S3Service, FilesService, UsersService, SchoolYearService];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([File, User, SchoolYear])],
  providers: [...servicesImports],
  exports: [...servicesImports],
})
class RepoModule {}
export default RepoModule;
