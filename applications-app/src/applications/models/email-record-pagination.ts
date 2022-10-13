import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { EmailRecord } from './email-record.entity';

@ObjectType()
export class EmailRecordPagination {
  @Field((type) => [EmailRecord])
  results?: EmailRecord[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
