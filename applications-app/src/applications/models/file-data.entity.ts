import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { File } from './file.entity';

@ObjectType()
export class FileData {
  @Field((type) => [File])
  results?: File[];
}

@ArgsType()
export class DeleteFileArgs {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly fileId: string;
}
