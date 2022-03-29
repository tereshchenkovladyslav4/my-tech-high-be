import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Application } from './application.entity';
import { Parent } from './parent.entity';
import { Student } from './student.entity';

@ObjectType()
export class ParentApplication {

  @Field((type) => Parent)
  parent?: Parent

  @Field((type) => [Student])
  students?: Student[]
}
