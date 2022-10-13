import { Field, ID, InputType, Int } from '@nestjs/graphql';

type SortType = {
  column: 'name' | 'abbreviation';
  direction: 'ASC' | 'DESC';
};

@InputType()
export class SchoolPartnerArgs {
  @Field((type) => Sort)
  sort: SortType = null;

  @Field((type) => ID)
  region_id = 0;

  @Field((type) => ID)
  school_year_id = 0;
}

@InputType('Sort')
export class Sort {
  @Field((type) => String)
  column;

  @Field((type) => String)
  direction;
}
