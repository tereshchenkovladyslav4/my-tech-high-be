import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DocumentItemInput {
  @Field((type)=> Int, { nullable: true })
  mth_file_id?: number

  @Field( (type) => String, { nullable: true } )
  kind?: string
}