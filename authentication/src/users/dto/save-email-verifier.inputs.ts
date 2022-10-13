import { Field, InputType, Int } from '@nestjs/graphql';
import * as Moment from 'moment';

@InputType()
export class SaveEmailVerifierInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  user_id: number;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field({ nullable: true, defaultValue: Moment().format('YYYY-MM-DD HH:mm:ss') })
  date_created?: Date;

  @Field({ nullable: true })
  date_verified?: Date;

  @Field(() => Int, { nullable: true })
  verified?: number;

  @Field(() => Int, { nullable: true })
  verification_type?: number;
}
