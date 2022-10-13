import { Field, ObjectType } from '@nestjs/graphql';
import { ReadStream } from 'fs';

@ObjectType()
export class FileUpload {
  @Field(() => String, { nullable: true })
  filename: string;

  @Field(() => String, { nullable: true })
  mimetype: string;

  @Field(() => String, { nullable: true })
  encoding: string;

  @Field(() => ReadStream)
  stream?: ReadStream;
}
