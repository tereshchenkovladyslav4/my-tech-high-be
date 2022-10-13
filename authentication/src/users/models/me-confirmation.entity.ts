import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class MeConfirmation {
  @Field((type) => String)
  token?: string;

  @Field((type) => String)
  email?: string;

  @Field()
  status?: string;
}
