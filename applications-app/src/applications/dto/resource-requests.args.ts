import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class ResourceRequestsArgs {
  @Field(() => Int)
  schoolYearId: number;

  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field(() => String)
  @Min(1)
  @Max(50)
  sort = 'status|ASC';

  @Field(() => ResourceRequestFilters)
  filter = null;

  @Field(() => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('ResourceRequestFilters')
export class ResourceRequestFilters {
  @Field(() => [String])
  studentStatuses = [];

  @Field(() => [String])
  statuses = [];

  @Field(() => [String])
  relations = [];

  @Field(() => [String])
  features = [];

  @Field(() => [String])
  types = [];

  @Field(() => [String])
  resources = [];

  @Field(() => [String])
  courses = [];
}
