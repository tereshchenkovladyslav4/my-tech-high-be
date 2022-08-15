import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Person } from './person.entity';
import { Parent } from './parent.entity';
import { StudentGradeLevel } from './student-grade-level.entity';
import { Application } from './application.entity';
import { StudentCurrentStatus } from './student-current-status.entity';
import { StudentStatus } from './student-status.entity';
import { Packet } from './packet.entity';
import { StudentStatusHistory } from './student-status-history.entity';
import { StudentReenrollmentStatus } from './student-reenrollment-status.entity';
import { Withdrawal } from './withdrawal.entity';
import { StudentHiddenResource } from './student-hidden-resource.entity';
import { SchoolEnrollment } from './school-enrollment.entity';
import { ResourceCart } from './resource-cart.entity';

@ObjectType()
@Directive(
  '@key(fields: "student_id, parent_id, person_id,special_ed,diploma_seeking, testing_preference")',
)
@Entity('mth_student')
export class Student extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  student_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  parent_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  person_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  grade_level: number;

  @Column()
  @Field(() => Int, { nullable: true })
  special_ed: number;

  @Column()
  @Field(() => Int, { nullable: true })
  diploma_seeking: number;

  @Column()
  @Field(() => Int, { nullable: true })
  hidden: number;

  @Column()
  @Field(() => String, { nullable: true })
  school_of_enrollment: string;

  @Column()
  @Field(() => Int, { nullable: true })
  reenrolled: number;

  @Column()
  @Field(() => String, { nullable: true })
  teacher_notes: string;

  @Column()
  @Field(() => String, { nullable: true })
  testing_preference: string;

  @OneToOne((type) => Parent)
  @JoinColumn({ name: 'parent_id' })
  parent?: Parent;

  @OneToMany((type) => StudentGradeLevel, (gradeLevels) => gradeLevels.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  grade_levels?: StudentGradeLevel[];

  @Field((type) => StudentCurrentStatus)
  current_school_year_status?: StudentCurrentStatus;

  @OneToOne((type) => Person, (person) => person.person_id)
  @JoinColumn({ name: 'person_id', referencedColumnName: 'person_id' })
  person: Person;

  @OneToMany((type) => Application, (application) => application.student_id)
  applications?: Application[];

  @OneToMany((type) => Packet, (packet) => packet.student_id)
  packets?: Packet[];

  @OneToMany((type) => SchoolEnrollment, (soes) => soes.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => [SchoolEnrollment], { nullable: true })
  currentSoe: SchoolEnrollment[];

  @OneToMany((type) => SchoolEnrollment, (soes) => soes.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => [SchoolEnrollment], { nullable: true })
  previousSoe: SchoolEnrollment[];

  @OneToMany((type) => StudentStatus, (studentStatus) => studentStatus.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  status?: StudentStatus[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.Student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'StudentId' })
  @Field(() => [Withdrawal], { nullable: true })
  StudentWithdrawals: Withdrawal[];

  @OneToMany(
    (type) => StudentStatusHistory,
    (studentStatusHistory) => studentStatusHistory.student_id,
  )
  status_history?: StudentStatusHistory[];

  @OneToMany(
    (type) => StudentReenrollmentStatus,
    (studentReenrollmentStatus) => studentReenrollmentStatus.student_id,
  )
  reenrollment_status?: StudentReenrollmentStatus[];

  @OneToMany(
    () => StudentHiddenResource,
    (studentHiddenResource) => studentHiddenResource.Student,
  )
  @Field(() => [StudentHiddenResource], { nullable: true })
  HiddenResources: StudentHiddenResource[];

  @OneToMany(() => ResourceCart, (resourceCart) => resourceCart.Student)
  @Field(() => [StudentHiddenResource], { nullable: true })
  ResourcesInCart: StudentHiddenResource[];
}
