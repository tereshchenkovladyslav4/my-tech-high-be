import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Packet } from './packet.entity';
import { Application } from './application.entity';
import { Parent } from './parent.entity';
import { Person } from './person.entity';
import { StudentGradeLevel } from './student-grade-level.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "student_id, parent_id, person_id,special_ed,diploma_seeking, testing_preference")',
)
@Entity('mth_student')
export class Student extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  student_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  parent_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  person_id?: number;

  @Field((type) => [Packet], { nullable: true })
  packets?: Packet[];

  @OneToOne((type) => Person)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne((type) => Parent)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @OneToMany((type) => Application, (application) => application.student)
  applications?: Application[];

  @OneToOne((type) => StudentGradeLevel)
  @JoinColumn({ name: 'student_id' })
  student_grade_level: StudentGradeLevel;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  special_ed: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  diploma_seeking: number;

  @OneToMany((type) => StudentGradeLevel, (gradeLevels) => gradeLevels.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  grade_levels?: StudentGradeLevel[];

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  testing_preference?: string;
}
