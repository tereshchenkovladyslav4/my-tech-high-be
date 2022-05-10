import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class MePermission {
  @Field((type) => String)
  jwt?: string;

  @Field((type) => Boolean)
  unverified?: boolean;
}
