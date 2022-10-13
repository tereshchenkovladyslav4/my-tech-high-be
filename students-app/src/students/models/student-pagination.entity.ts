import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Student } from './student.entity';

@ObjectType()
export class StudentPagination {
  @Field((type) => [Student])
  results?: Student[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
