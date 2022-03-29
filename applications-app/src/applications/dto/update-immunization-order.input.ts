import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class updateImmunizationOrderInput {
  @Field(() => [String])
  ids: string[];
}
