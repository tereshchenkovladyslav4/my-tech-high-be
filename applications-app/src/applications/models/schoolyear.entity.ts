import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { Region } from './region.entity';
import { Resource } from './resource.entity';
import { ScheduleHistory } from './schedule-history.entity';
import { Schedule } from './schedule.entity';
import { ScheduleBuilder } from './scheduler-builder.entity';
import { SchoolPartner } from './school-partner.entity';
import { Subject } from './subject.entity';
import { ReduceFunds } from '../enums/reduce-funds.enum';
import { ReimbursementSetting } from './reimbursement-setting.entity';

@ObjectType()
@Directive(
  '@key(fields: "school_year_id, date_begin, date_end, date_reg_open, date_reg_close, RegionId, grades, special_ed, special_ed_options, birth_date_cut, enrollment_packet, SchoolPartners, midyear_application, midyear_application_open, midyear_application_close, testing_preference_title, testing_preference_description, opt_out_form_title, opt_out_form_description, schedule, diploma_seeking, testing_preference, schedule_builder_open, schedule_builder_close, second_semester_open, second_semester_close, midyear_schedule_open, midyear_schedule_close, homeroom_resource_open, homeroom_resource_close, learning_logs, learning_logs_first_second_semesters, reimbursements, require_software, direct_orders, ScheduleBuilder, Resources, ReimbursementSetting, IsCurrentYear")',
)
@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'school_year_id' })
  school_year_id: number;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  date_begin: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  date_end: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  date_reg_open: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  date_reg_close: string;

  @Column()
  reimburse_open: Date;

  @Column()
  reimburse_close: Date;

  @Column()
  direct_order_open: Date;

  @Column()
  direct_order_tech_open: Date;

  @Column()
  direct_order_close: Date;

  @Column()
  direct_order_tech_enabled?: number;

  @Column()
  second_sem_start: Date;

  @Column()
  second_sem_open: Date;

  @Column()
  second_sem_close: Date;

  @Column()
  re_enroll_open: Date;

  @Column()
  re_enroll_deadline: Date;

  @Column()
  log_submission_close: Date;

  @Column()
  application_close: Date;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  midyear_application_open: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  midyear_application_close: string;

  @Column()
  first_sem_learning_logs_close: Date;

  @Column()
  re_enroll_notification?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  midyear_application?: number;

  @Column('int', { name: 'RegionId', nullable: true })
  @Field(() => Int, { nullable: true })
  RegionId: number | null;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  birth_date_cut: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  special_ed: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  special_ed_options: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  enrollment_packet: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  grades: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  testing_preference_title: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  testing_preference_description: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  opt_out_form_title: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  opt_out_form_description: string;

  @Column('tinyint', { name: 'schedule', default: false })
  @Field(() => Boolean, { nullable: true })
  schedule: boolean;

  @Column('tinyint', { name: 'diploma_seeking', default: false })
  @Field(() => Boolean, { nullable: true })
  diploma_seeking: boolean;

  @Column('tinyint', { name: 'testing_preference', default: false })
  @Field(() => Boolean, { nullable: true })
  testing_preference: boolean;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  schedule_builder_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  schedule_builder_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  second_semester_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  second_semester_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  midyear_schedule_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  midyear_schedule_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  homeroom_resource_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  homeroom_resource_close: string;

  @Column('tinyint', { name: 'learning_logs', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  learning_logs: boolean;

  @Column('tinyint', { name: 'learning_logs_first_second_semesters', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  learning_logs_first_second_semesters: boolean;

  @Column({
    type: 'enum',
    enum: ReduceFunds,
    comment: 'NONE: NONE(Disabled), TECHNOLOGY: Technology Allowance, SUPPLEMENTAL: Supplemental Learning Funds',
    default: null,
  })
  @Field(() => ReduceFunds, { nullable: true })
  reimbursements?: ReduceFunds;

  @Column('tinyint', { name: 'require_software', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  require_software: boolean;

  @Column({
    type: 'enum',
    enum: ReduceFunds,
    comment: 'NONE: NONE(Disabled), TECHNOLOGY: Technology Allowance, SUPPLEMENTAL: Supplemental Learning Funds',
    default: null,
  })
  @Field(() => ReduceFunds, { nullable: true })
  direct_orders?: ReduceFunds;

  @ManyToOne(() => Region, (region) => region.schoolYears)
  @JoinColumn([{ name: 'RegionId', referencedColumnName: 'id' }])
  region: Region;

  @OneToMany(() => Resource, (resource) => resource.SchoolYear)
  @Field(() => [Resource], { nullable: true })
  Resources: Resource[];

  @OneToMany(() => Assessment, (assessment) => assessment.SchoolYear)
  @Field(() => [Assessment], { nullable: true })
  Assessments: Assessment[];

  @OneToMany(() => SchoolPartner, (schoolPartner) => schoolPartner.schoolYear)
  @Field(() => [SchoolPartner], { nullable: true })
  SchoolPartners: SchoolPartner[];

  @OneToOne(() => ScheduleBuilder, (scheduleBuilder) => scheduleBuilder.schoolYear)
  @Field(() => ScheduleBuilder, { nullable: true })
  ScheduleBuilder: ScheduleBuilder;

  @OneToMany(() => Schedule, (schedule) => schedule.SchoolYear)
  @Field(() => [Schedule], { nullable: true })
  Schedules: Schedule[];

  @OneToMany(() => ScheduleHistory, (scheduleHistory) => scheduleHistory.SchoolYear)
  @Field(() => [ScheduleHistory], { nullable: true })
  ScheduleHistories: ScheduleHistory[];

  @OneToMany(() => Subject, (subject) => subject.SchoolYear)
  @Field(() => [Subject], { nullable: true })
  Subjects: Subject[];

  @OneToOne(() => ReimbursementSetting, (reimbursementSetting) => reimbursementSetting.SchoolYear)
  @Field(() => ReimbursementSetting, { nullable: true })
  ReimbursementSetting: ReimbursementSetting;

  @Field(() => Boolean, { nullable: true })
  IsCurrentYear: boolean;
}
