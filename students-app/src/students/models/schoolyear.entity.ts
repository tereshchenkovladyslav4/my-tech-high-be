import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "school_year_id ,date_begin, date_end, date_reg_open, date_reg_close, RegionId, grades, special_ed, birth_date_cut")',
)
@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  school_year_id?: number;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_begin: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_end: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_reg_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_reg_close: Date;

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

  @Column()
  @Field(() => Date, { nullable: true })
  midyear_application_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  midyear_application_close: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  first_sem_learning_logs_close: Date;

  @Column()
  @Field(() => Int, { nullable: true })
  re_enroll_notification?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  midyear_application?: number;

  @Column('int', { name: 'RegionId', nullable: true })
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  RegionId?: number;

  @Column()
  @Field((type) => Date, { nullable: true })
  @Directive('@external')
  birth_date_cut: Date;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  @Directive('@external')
  special_ed: boolean;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  grades: string;
}
