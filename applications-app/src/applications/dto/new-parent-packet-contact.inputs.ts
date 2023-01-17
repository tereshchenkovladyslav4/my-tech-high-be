import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewParentPacketContactInput {
  @Field(() => String, { nullable: true })
  secondary_contact_first?: string;

  @Field(() => String, { nullable: true })
  secondary_contact_last?: string;

  @Field(() => String, { nullable: true })
  school_district?: string;

  @Field({ nullable: true })
  meta?: string;
}
