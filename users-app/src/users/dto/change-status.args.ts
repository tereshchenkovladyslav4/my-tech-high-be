import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class ChangeStatusArgs {
  @Field(() => ID)
  @IsNotEmpty()
  user_id?: number;

  @Field(() => String)
  @IsNotEmpty()
  status?: string;

  @Field(() => Int)
  @IsNotEmpty()
  creator_id?: number;
}
