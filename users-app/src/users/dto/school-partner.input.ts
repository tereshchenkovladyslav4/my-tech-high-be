import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SchoolPartnerInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;

  @Field(() => String, { nullable: true })
  photo?: string;

  @Field(() => Number, { defaultValue: 1 })
  region_id: number;

  @Field(() => Number, { defaultValue: 1 })
  school_year_id: number;
}
