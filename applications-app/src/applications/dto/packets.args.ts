import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min, IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class PacketsArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field(() => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field(() => String)
  @Min(1)
  @Max(50)
  sort = 'status|ASC';

  @Field(() => String)
  @Min(1)
  @Max(50)
  search = '';

  @Field(() => String)
  timezoneOffsetStr = '';

  @Field(() => Int)
  selectedYearId = null;

  @Field(() => [String])
  filters: string[] = ['Submitted', 'Resubmitted'];
}

@ArgsType()
export class DeletePacketArgs {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly packetIds: string;
}
