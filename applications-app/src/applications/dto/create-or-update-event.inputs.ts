import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateEventInput {
  @Field(() => Int, { nullable: true })
  event_id?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  TypeId?: number;

  @Field((type) => Date, { nullable: true })
  start_date?: Date;

  @Field((type) => Date, { nullable: true })
  end_date?: Date;

  @Field((type) => String, { nullable: true })
  description?: string;

  @Field((type) => Boolean, { nullable: true })
  all_day?: boolean;

  @Field((type) => String, { nullable: true })
  filter_grades?: string;

  @Field((type) => String, { nullable: true })
  filter_program_year?: string;

  @Field((type) => String, { nullable: true })
  filter_users?: string;

  @Field((type) => String, { nullable: true })
  filter_school_of_enrollment?: string;

  @Field((type) => String, { nullable: true })
  filter_other?: string;

  @Field((type) => String, { nullable: true })
  filter_provider?: string;
}
