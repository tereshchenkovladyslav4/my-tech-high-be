import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateImmunizationSettingsInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int)
  region_id: number;

  @Field(() => String)
  title?: string;

  @Field(() => String)
  min_grade_level?: string;

  @Field(() => String)
  max_grade_level?: string;

  @Field(() => Int)
  min_school_year_required?: number;

  @Field(() => Int)
  max_school_year_required?: number;

  @Field(() => Int)
  immunity_allowed?: number;

  @Field(() => Int)
  exempt_update?: number;

  @Field(() => String, { nullable: true })
  level_exempt_update?: string;

  @Field(() => String, { nullable: true })
  email_update_template?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  consecutive_vaccine?: number;

  @Field(() => Int, { nullable: true })
  min_spacing_interval?: number;

  @Field(() => Int, { nullable: true })
  min_spacing_date?: number;

  @Field(() => Int, { nullable: true })
  max_spacing_interval?: number;

  @Field(() => Int, { nullable: true })
  max_spacing_date?: number;

  @Field(() => String)
  tooltip?: string;

  @Field(() => Boolean)
  is_enabled?: boolean;

  @Field(() => Int)
  order?: number;
}
