import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PacketCountArgs {
  @Field(() => ID)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field(() => ID)
  school_year_id = null;

  @Field(() => [String])
  filters: string[] = ['Submitted', 'Resubmitted', 'Age Issue'];
}
