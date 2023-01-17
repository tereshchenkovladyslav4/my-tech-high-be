import { Field, ArgsType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ArgsType()
export class FilterInput {
  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  filter: any;
}
