import { Field, ObjectType, Int } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class UserPagination {
  @Field(() => [User])
  results?: User[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
