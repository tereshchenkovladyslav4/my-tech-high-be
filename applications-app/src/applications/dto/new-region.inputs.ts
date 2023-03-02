import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength, Length } from 'class-validator';

@InputType()
export class CreateRegionInput {
  @Field({ nullable: true })
  @MaxLength(60)
  @Length(1, 60)
  name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  program?: string;
}
