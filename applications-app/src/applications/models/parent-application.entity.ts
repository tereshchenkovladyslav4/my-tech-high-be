import { Field, ObjectType } from '@nestjs/graphql';
import { Parent } from './parent.entity';
import { Student } from './student.entity';

@ObjectType()
export class ParentApplication {
  @Field(() => Parent)
  parent?: Parent;

  @Field(() => [Student])
  students?: Student[];
}
