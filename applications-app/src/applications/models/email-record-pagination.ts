import { Field, ObjectType, Int } from '@nestjs/graphql';
import { EmailRecord } from './email-record.entity';

@ObjectType()
export class EmailRecordPagination {
  @Field(() => [EmailRecord])
  results?: EmailRecord[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
