import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateCourseInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  provider_id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  min_grade?: number;

  @Field(() => Int, { nullable: true })
  max_grade?: number;

  @Field(() => Int, { nullable: true })
  min_alt_grade?: number;

  @Field(() => Int, { nullable: true })
  max_alt_grade?: number;

  @Field(() => Boolean, { nullable: true })
  always_unlock: boolean;

  @Field(() => Boolean, { nullable: true })
  software_reimbursement: boolean;

  @Field(() => Boolean, { nullable: true })
  display_notification: boolean;

  @Field(() => String, { nullable: true })
  course_notification?: string;

  @Field(() => Boolean, { nullable: true })
  launchpad_course: boolean;

  @Field(() => String, { nullable: true })
  course_id?: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  diploma_seeking_path?: string;

  @Field(() => Number, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  reduce_funds?: string;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  reduce_funds_notification?: string;

  @Field(() => String, { nullable: true })
  titles: string;

  @Field(() => Boolean, { nullable: true })
  allow_request: boolean;

  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @Field(() => Int, { nullable: true })
  resource_id?: number;
}
