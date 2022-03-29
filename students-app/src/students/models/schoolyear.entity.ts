import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "school_year_id")')
@Entity({ name: 'mth_schoolyear'})
export class SchoolYear extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  school_year_id?: number

  @Column()
  @Field(() => Date, { nullable: true })
  date_begin: Date

  @Column()
  @Field(() => Date, { nullable: true })
  date_end: Date

  @Column()
  @Field(() => Date, { nullable: true })
  date_reg_open: Date

  @Column()
  @Field(() => Date, { nullable: true })
  date_reg_close: Date

  @Column()
  @Field(() => Date, { nullable: true })
  reimburse_open: Date

  @Column()
  @Field(() => Date, { nullable: true })
  reimburse_close: Date

  @Column()
  @Field(() => Date, { nullable: true })
  direct_order_open: Date

  @Column()
  @Field(() => Date, { nullable: true })
  direct_order_tech_open: Date

  @Column()
  @Field(() => Date, { nullable: true })
  direct_order_close: Date
  
  @Column()
  @Field(() => Int, { nullable: true })
  direct_order_tech_enabled?: number

  @Column()
  @Field(() => Date, { nullable: true })
  second_sem_start: Date

  @Column()
  @Field(() => Date, { nullable: true })
  second_sem_open: Date

  @Column()
  @Field(() => Date, { nullable: true })
  second_sem_close: Date

  @Column()
  @Field(() => Date, { nullable: true })
  re_enroll_open: Date

  @Column()
  @Field(() => Date, { nullable: true })
  re_enroll_deadline: Date

  @Column()
  @Field(() => Date, { nullable: true })
  log_submission_close: Date

  @Column()
  @Field(() => Date, { nullable: true })
  application_close: Date

  @Column()
  @Field(() => Date, { nullable: true })
  midyear_application_open: Date

  @Column()
  @Field(() => Date, { nullable: true })
  midyear_application_close: Date

  @Column()
  @Field(() => Date, { nullable: true })
  first_sem_learning_logs_close: Date

  @Column()
  @Field(() => Int, { nullable: true })
  re_enroll_notification?: number
  
  @Column()
  @Field(() => Int, { nullable: true })
  midyear_application?: number
}
