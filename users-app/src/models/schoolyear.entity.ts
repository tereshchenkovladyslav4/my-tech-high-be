import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
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
import { Region } from './region.entity';
import { ScheduleBuilder } from './scheduler-builder.entity';
import { SchoolPartner } from './school-partner.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "school_year_id, date_begin, date_end, date_reg_open, date_reg_close, RegionId, grades, special_ed, special_ed_options, birth_date_cut, enrollment_packet, SchoolPartners, midyear_application, midyear_application_open, midyear_application_close, testing_preference_title, testing_preference_description, opt_out_form_title, opt_out_form_description, schedule, diploma_seeking, testing_preference, schedule_builder_open, schedule_builder_close, second_semester_open, second_semester_close, midyear_schedule_open, midyear_schedule_close, ScheduleBuilder")',
)
@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
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
  @Directive('@external')
  midyear_application_open: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_application_close: string;

  @Column()
  first_sem_learning_logs_close: Date;

  @Column()
  re_enroll_notification?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  midyear_application?: number;

  @Column('int', { name: 'RegionId', nullable: true })
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  RegionId: number | null;

  @Column({ type: 'date' })
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  birth_date_cut: string;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  @Directive('@external')
  special_ed: boolean;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  special_ed_options: string;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  @Directive('@external')
  enrollment_packet: boolean;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  grades: string;

  @Column({ type: 'varchar', nullable: true })
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  testing_preference_title: string;

  @Column({ type: 'text', nullable: true })
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  testing_preference_description: string;

  @Column({ type: 'varchar', nullable: true })
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  opt_out_form_title: string;

  @Column({ type: 'text', nullable: true })
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  opt_out_form_description: string;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  @Directive('@external')
  schedule: boolean;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  @Directive('@external')
  diploma_seeking: boolean;

  @Column()
  @Field((type) => Boolean, { nullable: true })
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

  @OneToMany(() => SchoolPartner, (schoolPartner) => schoolPartner.schoolYear)
  @Field(() => [SchoolPartner], { nullable: true })
  @Directive('@external')
  SchoolPartners: SchoolPartner[];

  @ManyToOne(() => Region, (region) => region.SchoolYears, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'RegionId', referencedColumnName: 'id' }])
  @Field(() => Region, { nullable: true })
  Region: Region;

  @Field(() => Boolean, { nullable: true })
  MainyearApplicatable: boolean;

  @Field(() => Boolean, { nullable: true })
  MidyearApplicatable: boolean;

  @OneToOne(() => ScheduleBuilder, (schoolPartner) => schoolPartner.schoolYear)
  @Field(() => ScheduleBuilder, { nullable: true })
  @Directive('@external')
  ScheduleBuilder: ScheduleBuilder;
}
