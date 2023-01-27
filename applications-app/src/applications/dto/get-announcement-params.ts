import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetAnnouncementParams {
  @Field(() => Number, { nullable: true })
  region_id: number;

  @Field(() => String, { nullable: true })
  search?: string;
}
