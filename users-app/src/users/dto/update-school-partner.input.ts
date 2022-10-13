import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateSchoolPartnerInput {
  @Field(() => String)
  name?: string;

  @Field(() => String)
  abbreviation?: string;

  @Field(() => String, { nullable: true })
  photo?: string;

  @Field(() => Int)
  school_partner_id: number;
}
