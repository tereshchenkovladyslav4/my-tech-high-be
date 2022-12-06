import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Classes } from './classes.entity';
@ObjectType()
@Directive('@key(fields: "master_id")')
@Entity('mth_assignments')
export class Assignment extends BaseEntity {
  @Column()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int)
  master_id: number;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => Date)
  due_date: Date;

  @Column()
  @Field(() => Date)
  reminder_date: Date;

  @Column()
  @Field(() => Date)
  auto_grade: Date;

  @Column()
  @Field(() => Date)
  teacher_deadline: Date;

  @Column()
  @Field(() => Int)
  auto_grade_email: number;
}
