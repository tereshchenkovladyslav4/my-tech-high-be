import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindImmunizationSettingsInput {
  @Field(() => Boolean, { nullable: true })
  is_enabled?: boolean;

  @Field(() => Int, { nullable: true })
  region_id?: number;
}
