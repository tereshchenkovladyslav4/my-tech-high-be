import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateResourceInput {
  @Field(() => Int, { nullable: true })
  resource_id?: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number | null;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => String, { nullable: true })
  subtitle?: string;

  @Field(() => Float, { nullable: true })
  price: number | null;

  @Field(() => String, { nullable: true })
  website: string;

  @Field(() => String, { nullable: true })
  grades: string;

  @Field(() => String, { nullable: true })
  std_user_name: string;

  @Field(() => String, { nullable: true })
  std_password: string;

  @Field(() => String, { nullable: true })
  detail: string;

  @Field(() => Int, { nullable: true })
  priority: number | null;

  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Field(() => Int, { nullable: true })
  resource_limit: number | null;

  @Field(() => Boolean, { nullable: true })
  add_resource_level: boolean;

  @Field(() => String, { nullable: true })
  resourceLevelsStr: string;

  @Field(() => Boolean, { nullable: true })
  family_resource: boolean;

  @Field(() => Boolean, { nullable: true })
  allow_request: boolean;

  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @Field(() => Boolean, { nullable: true })
  software_reimbursement: boolean;
}
