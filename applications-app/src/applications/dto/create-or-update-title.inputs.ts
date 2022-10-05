import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateTitleInput {
  @Field(() => Int, { nullable: true })
  title_id?: number;

  @Field(() => Int, { nullable: true })
  subject_id: number | null;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  min_grade?: string;

  @Field(() => String, { nullable: true })
  max_grade?: string;

  @Field(() => String, { nullable: true })
  min_alt_grade?: string;

  @Field(() => String, { nullable: true })
  max_alt_grade?: string;

  @Field(() => String, { nullable: true })
  diploma_seeking_path?: string;

  @Field(() => String, { nullable: true })
  reduce_funds?: string;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => Boolean, { nullable: true })
  always_unlock: boolean;

  @Field(() => Boolean, { nullable: true })
  custom_built: boolean;

  @Field(() => Boolean, { nullable: true })
  third_party_provider: boolean;

  @Field(() => Boolean, { nullable: true })
  split_enrollment: boolean;

  @Field(() => Boolean, { nullable: true })
  software_reimbursement: boolean;

  @Field(() => Boolean, { nullable: true })
  display_notification: boolean;

  @Field(() => Boolean, { nullable: true })
  launchpad_course: boolean;

  @Field(() => String, { nullable: true })
  course_id?: string;

  @Field(() => String, { nullable: true })
  reduce_funds_notification?: string;

  @Field(() => String, { nullable: true })
  custom_built_description?: string;

  @Field(() => String, { nullable: true })
  subject_notification?: string;

  @Field(() => String, { nullable: true })
  state_course_codes?: string;

  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Field(() => Boolean, { nullable: true })
  deleted: boolean;
}
