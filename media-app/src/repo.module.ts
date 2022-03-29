import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './services/s3.services';
import { FilesService } from './services/files.services';
import { UsersService } from './services/users.services';
import { File } from './models/file.entity';
import { User } from './models/user.entity';

const servicesImports = [
  S3Service,
  FilesService,
  UsersService
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
      User
    ]),
  ],
  providers: [...servicesImports],
  exports: [...servicesImports],
})
class RepoModule { }
export default RepoModule;
