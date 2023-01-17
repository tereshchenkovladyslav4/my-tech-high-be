import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindProvidersInput {
  @Field(() => Int, { nullable: true })
  schoolYearId: number;

  @Field(() => String, { nullable: true })
  searchField?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
