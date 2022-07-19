import {
  Directive,
  Field,
  ID,
  ObjectType,
  Int,
  InputType,
} from '@nestjs/graphql';
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
import { StudentStatus } from './student-status.entity';
import { Withdrawal } from './withdrawal.entity';
import { StudentReenrollmentStatus } from './student-reenrollment-status.entity';

@InputType('student')
@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "student_id, parent_id, person_id, special_ed, diploma_seeking, testing_preference")',
)
@Entity('mth_student')
export class Student extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'student_id' })
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

  @OneToOne((type) => Parent)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @OneToMany((type) => Application, (application) => application.student)
  applications?: Application[];

  @OneToOne((type) => StudentGradeLevel, (gradeLevel) => gradeLevel.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => StudentGradeLevel, { nullable: true })
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

  @OneToMany((type) => StudentStatus, (studentStatus) => studentStatus.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  status?: StudentStatus[];

  @OneToMany(
    (type) => StudentReenrollmentStatus,
    (studentReenrollmentStatus) => studentReenrollmentStatus.student,
  )
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  reenrollment_status?: StudentReenrollmentStatus[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.Student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'StudentId' })
  @Field(() => [Withdrawal], { nullable: true })
  Withdrawals: Withdrawal[];

  @OneToOne(() => Person, (person) => person.Student, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'person_id', referencedColumnName: 'person_id' })
  @Field(() => Person, { nullable: true })
  person: Person;
}
