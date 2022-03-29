import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadedFileResponse {
  @Field(() => String, { nullable: true })
  filename: string;

  @Field(() => String, { nullable: true })
  mimetype: string;

  @Field(() => String, { nullable: true })
  encoding: string;

  @Field(() => String, { nullable: true })
  url: string;
}