import { ArgsType, Field, Int ,InputType} from '@nestjs/graphql';
import { Max, Min, IsOptional } from 'class-validator';

@ArgsType()
export class ApplicationsArgs {
  @Field(type => Int)
  @Min(0)
  skip = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field(type => String)
  @Min(1)
  @Max(50)
  sort = 'status|ASC';

  @Field(type => ApplicationFilters)
  filter = null;

  @Field(type => String)
  @Min(1)
  @Max(50)
  search = '';

}

@InputType('ApplicationFilters')
export class ApplicationFilters {
  @Field(type => [String])
  grades = []

  @Field(type => [String])
  schoolYear = []

  @Field(type => [String])
  specialEd = []

  @Field(type => [String])
  status = []

  @Field(type => [String])
  accountStatus = []

  @Field(type => [String])
  visibility = []
}

