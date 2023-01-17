import { Field, ID, InputType } from '@nestjs/graphql';

type SortType = {
  column: 'name' | 'abbreviation';
  direction: 'ASC' | 'DESC';
};

@InputType()
export class SchoolPartnerArgs {
  @Field(() => Sort)
  sort: SortType = null;

  @Field(() => ID)
  region_id = 0;

  @Field(() => ID)
  school_year_id = 0;
}

@InputType('Sort')
export class Sort {
  @Field(() => String)
  column;

  @Field(() => String)
  direction;
}
