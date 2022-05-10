import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class UserPagination {
  @Field((type) => [User])
  results?: User[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
