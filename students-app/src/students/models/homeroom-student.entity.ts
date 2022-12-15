import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { MTHClasses } from './classes.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "id,student_id,school_year_id,teacher_id,auto_grade,teacher")')
@Entity('mth_homeroom_student')
export class MTHHomeroomStudent extends BaseEntity {
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

  @OneToMany((type) => Student, (student) => student.currentHomeroom)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => [Student], { nullable: true })
  student: Student[];

  @ManyToOne((type) => MTHClasses, (classes) => classes.homeroom)
  @JoinColumn({ name: 'teacher_id', referencedColumnName: 'class_id' })
  @Field(() => MTHClasses, { nullable: true })
  teacher: MTHClasses;
}
