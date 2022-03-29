import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Student } from './student.entity';

@ObjectType()
export class ToDoItem {

  @Field(() => String, { nullable: true })
  phrase: string;

  @Field(() => String, { nullable: true })
  button: string;

  @Field(() => String, { nullable: true })
  icon: string;

  @Field(() => Int, { nullable: true })
  dashboard: number;

  @Field(() => Int, { nullable: true })
  homeroom: number;

  @Field(() => [Student], { nullable: true })
  students?: Student[];
}
