import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Student } from './student.entity';

@ObjectType()
export class StudentPagination {
  @Field(() => [Student])
  results?: Student[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
