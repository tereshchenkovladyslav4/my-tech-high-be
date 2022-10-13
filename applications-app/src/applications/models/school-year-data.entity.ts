import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class SchoolYearData {
  @Field((type) => [SchoolDataCount])
  students?: SchoolDataCount[];

  @Field((type) => [SchoolDataCount])
  parents?: SchoolDataCount[];

  @Field((type) => [SchoolDataCount])
  special_ed?: SchoolDataCount[];
}

@ObjectType()
export class SchoolDataCount {
  @Field(() => String)
  status?: string;

  @Field((type) => Int)
  count?: number;
}
