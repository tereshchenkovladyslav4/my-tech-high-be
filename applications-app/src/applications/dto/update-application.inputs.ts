import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateApplicationInput {
  @Field(() => Int)
  application_id?: number;

  @Field(() => Int)
  school_year_id?: number;

  @Field(() => Boolean)
  midyear_application?: boolean;

  @Field(() => Int, { nullable: true })
  relation_status?: number;

  @Field(() => String)
  status?: string;
}
