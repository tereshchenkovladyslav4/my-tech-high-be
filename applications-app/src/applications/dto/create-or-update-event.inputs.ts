import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateEventInput {
  @Field(() => Int, { nullable: true })
  event_id?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  TypeId?: number;

  @Field(() => Date, { nullable: true })
  start_date?: Date;

  @Field(() => Date, { nullable: true })
  end_date?: Date;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  all_day?: boolean;

  @Field(() => Boolean, { nullable: true })
  has_rsvp?: boolean;

  @Field(() => String, { nullable: true })
  filter_grades?: string;

  @Field(() => String, { nullable: true })
  filter_program_year?: string;

  @Field(() => String, { nullable: true })
  filter_users?: string;

  @Field(() => String, { nullable: true })
  filter_school_of_enrollment?: string;

  @Field(() => String, { nullable: true })
  filter_other?: string;

  @Field(() => String, { nullable: true })
  filter_provider?: string;
}
