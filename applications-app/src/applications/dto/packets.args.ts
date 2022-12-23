import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min, IsOptional, IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class PacketsArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field((type) => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field((type) => String)
  @Min(1)
  @Max(50)
  sort = 'status|ASC';

  @Field((type) => String)
  @Min(1)
  @Max(50)
  search = '';

  @Field((type) => Int)
  selectedYearId = null;

  @Field((type) => [String])
  filters: string[] = ['Submitted', 'Resubmitted'];
}

@ArgsType()
export class DeletePacketArgs {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly packetIds: string;
}
