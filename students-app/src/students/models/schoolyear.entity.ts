import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { SchoolPartner } from './school-partner.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "school_year_id, date_begin, date_end, date_reg_open, date_reg_close, RegionId, grades, special_ed, special_ed_options, birth_date_cut, enrollment_packet, SchoolPartners, midyear_application, midyear_application_open, midyear_application_close, testing_preference_title, testing_preference_description, opt_out_form_title, opt_out_form_description")',
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
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  RegionId?: number;

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

  @OneToMany(() => SchoolPartner, (schoolPartner) => schoolPartner.schoolYear)
  @Field(() => [SchoolPartner], { nullable: true })
  @Directive('@external')
  SchoolPartners: SchoolPartner[];
}
