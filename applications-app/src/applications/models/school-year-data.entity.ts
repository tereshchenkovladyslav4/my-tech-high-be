import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class SchoolYearData {
  @Field(() => [SchoolDataCount])
  students?: SchoolDataCount[];

  @Field(() => [SchoolDataCount])
  parents?: SchoolDataCount[];

  @Field(() => [SchoolDataCount])
  special_ed?: SchoolDataCount[];
}

@ObjectType()
export class SchoolDataCount {
  @Field(() => String)
  status?: string;

  @Field(() => Int)
  count?: number;
}
