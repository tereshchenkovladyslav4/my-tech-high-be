import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@ObjectType()
@Directive('@key(fields: "id,student_id,school_year_id,teacher_id,auto_grade")')
@Entity('mth_homeroom_student')
export class HomeroomStudent extends BaseEntity {
  @Column()
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int)
  student_id?: number;

  @Column()
  @Field(() => Int)
  school_year_id?: number;

  @Column()
  @Field(() => Int)
  teacher_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  auto_grade?: string;

}
