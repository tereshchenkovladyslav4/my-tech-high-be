import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class GetPersonInfoArgs {
  @Field()
  @IsNotEmpty()
  region_id: number;

  @Field()
  @IsNotEmpty()
  search: string;
}
