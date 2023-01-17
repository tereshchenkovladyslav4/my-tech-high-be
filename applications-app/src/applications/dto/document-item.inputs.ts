import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DocumentItemInput {
  @Field(() => Int, { nullable: true })
  mth_file_id?: number;

  @Field(() => String, { nullable: true })
  kind?: string;
}
