import { Directive, Field, ObjectType, Int, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
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
import { StudentRecord } from './student-record.entity';
import { ResourceRequest } from './resource-request.entity';
import { Schedule } from './schedule.entity';
import { ScheduleHistory } from './schedule-history.entity';
import { HomeroomStudent } from './homeroom-student.entity';

@ObjectType()
@Directive(
  '@key(fields: "student_id, parent_id, person_id, special_ed, diploma_seeking, testing_preference, opt_out_form_signature_name, opt_out_form_signature_file_id, username_first, username_last, username_first_last, username_last_first, username_last_first_year, username_last_firstinitial, username_last_first_mth, username_last_first_birth, username_first_last_domain, username_student_email, username_parent_email")',
)
@Entity('mth_student')
export class Student extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'student_id' })
  student_id: number;

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

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  opt_out_form_signature_name: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  opt_out_form_signature_file_id: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  username_first?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  username_last?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  username_first_last?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  username_last_first?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  username_last_first_year?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  username_last_firstinitial?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  username_last_first_mth?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  username_last_first_birth?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  username_first_last_domain?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  username_student_email?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  username_parent_email?: string;

  @OneToOne(() => Parent)
  @JoinColumn({ name: 'parent_id' })
  parent?: Parent;

  @OneToMany(() => StudentGradeLevel, (gradeLevels) => gradeLevels.Student)
  @Field(() => [StudentGradeLevel])
  grade_levels?: StudentGradeLevel[];

  @Field(() => StudentCurrentStatus)
  current_school_year_status?: StudentCurrentStatus;

  @OneToOne(() => Person, (person) => person.person_id)
  @JoinColumn({ name: 'person_id', referencedColumnName: 'person_id' })
  person: Person;

  @OneToMany(() => Application, (application) => application.student_id)
  applications?: Application[];

  @OneToMany(() => Packet, (packet) => packet.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  packets?: Packet[];

  @OneToMany(() => SchoolEnrollment, (soes) => soes.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => [SchoolEnrollment], { nullable: true })
  currentSoe: SchoolEnrollment[];

  @OneToMany(() => SchoolEnrollment, (soes) => soes.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => [SchoolEnrollment], { nullable: true })
  previousSoe: SchoolEnrollment[];

  @ManyToOne(() => HomeroomStudent, (homeroom) => homeroom.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => HomeroomStudent, { nullable: true })
  currentHomeroom: HomeroomStudent;

  @ManyToOne(() => HomeroomStudent, (homeroom) => homeroom.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => HomeroomStudent, { nullable: true })
  previousHomeroom: HomeroomStudent;

  @OneToMany(() => StudentStatus, (studentStatus) => studentStatus.student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  status?: StudentStatus[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.Student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'StudentId' })
  @Field(() => [Withdrawal], { nullable: true })
  StudentWithdrawals: Withdrawal[];

  @OneToOne(() => StudentStatusHistory, (studentStatusHistory) => studentStatusHistory.Student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  status_history?: StudentStatusHistory[];

  @OneToMany(() => StudentReenrollmentStatus, (studentReenrollmentStatus) => studentReenrollmentStatus.student_id)
  reenrollment_status?: StudentReenrollmentStatus[];

  @OneToMany(() => StudentHiddenResource, (studentHiddenResource) => studentHiddenResource.Student)
  @Field(() => [StudentHiddenResource], { nullable: true })
  HiddenResources: StudentHiddenResource[];

  @OneToMany(() => ResourceCart, (resourceCart) => resourceCart.Student)
  @Field(() => [ResourceCart], { nullable: true })
  ResourcesInCart: ResourceCart[];

  @OneToMany(() => ResourceRequest, (resourceRequest) => resourceRequest.Student)
  @Field(() => [ResourceRequest], { nullable: true })
  ResourceRequests: ResourceRequest[];

  @OneToMany(() => StudentRecord, (record) => record.Student)
  @Field(() => [StudentRecord], { nullable: true })
  Records: StudentRecord[];

  @OneToMany(() => Schedule, (schedule) => schedule.Student)
  @Field(() => [Schedule], { nullable: true })
  StudentSchedules: Schedule[];

  @OneToMany(() => ScheduleHistory, (scheduleHistory) => scheduleHistory.Student)
  @Field(() => [ScheduleHistory], { nullable: true })
  StudentScheduleHistories: ScheduleHistory[];
}
