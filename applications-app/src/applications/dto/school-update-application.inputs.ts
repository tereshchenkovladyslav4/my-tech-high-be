import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateSchoolYearIdsInput {
  @Field(() => [String])
  @IsInt()
  application_ids?: string[];

  @Field(() => Int)
  @IsInt()
  school_year_id: number;

  @Field(() => Int)
  @IsInt()
  midyear_application?: number;
}
