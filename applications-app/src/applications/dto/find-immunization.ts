import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindImunizationSettingsInput {
  @Field(() => Boolean)
  is_enabled?: boolean;
}
