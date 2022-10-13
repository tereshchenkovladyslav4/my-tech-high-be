import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateFileInput {
  @Field()
  name?: string;

  @Field()
  type?: string;

  @Field()
  item1?: string;

  @Field({ defaultValue: '' })
  item2?: string;

  @Field({ defaultValue: '' })
  item3?: string;

  @Field()
  year?: number;

  @Field(() => Int, { defaultValue: 0 })
  is_new_upload_type?: number;

  @Field(() => Int, { nullable: true })
  uploaded_by?: number;
}
