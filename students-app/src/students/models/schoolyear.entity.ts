import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, OneToOne } from 'typeorm';
import { Resource } from './resource.entity';
import { Schedule } from './schedule.entity';
import { ScheduleBuilder } from './scheduler-builder.entity';
import { SchoolPartner } from './school-partner.entity';
import { ReduceFunds } from '../enums';
import { ReimbursementSetting } from './reimbursement-setting.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "school_year_id, date_begin, date_end, date_reg_open, date_reg_close, RegionId, grades, special_ed, special_ed_options, birth_date_cut, enrollment_packet, SchoolPartners, midyear_application, midyear_application_open, midyear_application_close, testing_preference_title, testing_preference_description, opt_out_form_title, opt_out_form_description, schedule, diploma_seeking, testing_preference, schedule_builder_open, schedule_builder_close, second_semester_open, second_semester_close, midyear_schedule_open, midyear_schedule_close, homeroom_resource_open, homeroom_resource_close, learning_logs, learning_logs_first_second_semesters, reimbursements, require_software, direct_orders, ScheduleBuilder, Resources, ReimbursementSetting, IsCurrentYear")',
)
@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  school_year_id?: number;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_begin: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_end: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_reg_open: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_reg_close: string;

  @Column()
  @Field(() => Date, { nullable: true })
  reimburse_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  reimburse_close: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  direct_order_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  direct_order_tech_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  direct_order_close: Date;

  @Column()
  @Field(() => Int, { nullable: true })
  direct_order_tech_enabled?: number;

  @Column()
  @Field(() => Date, { nullable: true })
  second_sem_start: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  second_sem_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  second_sem_close: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  re_enroll_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  re_enroll_deadline: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  log_submission_close: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  application_close: Date;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_application_open: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_application_close: string;

  @Column()
  @Field(() => Date, { nullable: true })
  first_sem_learning_logs_close: Date;

  @Column()
  @Field(() => Int, { nullable: true })
  re_enroll_notification?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  midyear_application?: number;

  @Column('int', { name: 'RegionId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  RegionId?: number;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  birth_date_cut: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  special_ed: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  special_ed_options: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  enrollment_packet: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grades: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  testing_preference_title: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  testing_preference_description: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  opt_out_form_title: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  opt_out_form_description: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  schedule: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  diploma_seeking: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  testing_preference: boolean;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  schedule_builder_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  schedule_builder_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  second_semester_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  second_semester_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_schedule_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_schedule_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  homeroom_resource_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  homeroom_resource_close: string;

  @Column('tinyint', { name: 'learning_logs', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  learning_logs: boolean;

  @Column('tinyint', { name: 'learning_logs_first_second_semesters', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  learning_logs_first_second_semesters: boolean;

  @Column({
    type: 'enum',
    enum: ReduceFunds,
    comment: 'NONE: NONE(Disabled), TECHNOLOGY: Technology Allowance, SUPPLEMENTAL: Supplemental Learning Funds',
    default: null,
  })
  @Field(() => ReduceFunds, { nullable: true })
  @Directive('@external')
  reimbursements?: ReduceFunds;

  @Column('tinyint', { name: 'require_software', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  require_software: boolean;

  @Column({
    type: 'enum',
    enum: ReduceFunds,
    comment: 'NONE: NONE(Disabled), TECHNOLOGY: Technology Allowance, SUPPLEMENTAL: Supplemental Learning Funds',
    default: null,
  })
  @Field(() => ReduceFunds, { nullable: true })
  @Directive('@external')
  direct_orders?: ReduceFunds;

  @OneToMany(() => Resource, (resource) => resource.SchoolYear)
  @Field(() => [Resource], { nullable: true })
  @Directive('@external')
  Resources: Resource[];

  @OneToMany(() => SchoolPartner, (schoolPartner) => schoolPartner.schoolYear)
  @Field(() => [SchoolPartner], { nullable: true })
  @Directive('@external')
  SchoolPartners: SchoolPartner[];

  @OneToOne(() => ScheduleBuilder, (schedule) => schedule.schoolYear)
  @Field(() => ScheduleBuilder, { nullable: true })
  @Directive('@external')
  ScheduleBuilder: ScheduleBuilder;

  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  IsCurrentYear: boolean;

  @Field(() => Boolean, { nullable: true })
  IsScheduleBuilderOpen: boolean;

  @Field(() => Boolean, { nullable: true })
  IsSecondSemesterOpen: boolean;

  @Field(() => String, { nullable: true })
  ScheduleStatus: string;

  @OneToOne(() => ReimbursementSetting, (reimbursementSetting) => reimbursementSetting.SchoolYear)
  @Field(() => ReimbursementSetting, { nullable: true })
  @Directive('@external')
  ReimbursementSetting: ReimbursementSetting;
}
