import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SchoolPartnerInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;
	
  @Field(() => String, {nullable: true})
  photo?: string;
}
