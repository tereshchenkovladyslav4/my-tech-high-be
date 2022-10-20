import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateAddressInput {
  @Field(() => Int, { nullable: true })
  address_id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  street?: string;

  @Field(() => String, { nullable: true })
  street2?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  zip?: string;

  @Field(() => Number, { nullable: true })
  county_id?: number;

  @Field(() => String, { nullable: true })
  country_id?: string;
}
