import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class ResponseDTO {
  @Field({ nullable: true })
  message: string;

  @Field({ nullable: true })
  error: boolean;

  @Field((type) => GraphQLJSON, { nullable: true })
  @IsOptional()
  results: any;

}
