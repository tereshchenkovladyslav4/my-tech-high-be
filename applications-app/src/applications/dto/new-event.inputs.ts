import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  TypeId?: number;

  @Field((type) => String, { nullable: true })
  start_date?: string;

  @Field((type) => String, { nullable: true })
  end_date?: string;

  @Field((type) => String, { nullable: true })
  time?: string;

  @Field((type) => String, { nullable: true })
  description?: string;

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
