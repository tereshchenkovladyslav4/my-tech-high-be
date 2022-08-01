import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApplicationRegion } from './region.entity';
import { Resource } from './resource.entity';

@ObjectType()
@Directive(
  '@key(fields: "school_year_id, date_begin, date_end, date_reg_open, date_reg_close, RegionId, grades, special_ed, special_ed_options, birth_date_cut, enrollment_packet")',
)
@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'school_year_id' })
  school_year_id: number;

  @Column()
  @Field(() => Date, { nullable: true })
  date_begin: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_end: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_reg_open: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_reg_close: Date;

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

  @Column()
  midyear_application_open: Date;

  @Column()
  midyear_application_close: Date;

  @Column()
  first_sem_learning_logs_close: Date;

  @Column()
  re_enroll_notification?: number;

  @Column()
  midyear_application?: number;

  @Column('int', { name: 'RegionId', nullable: true })
  @Field((type) => Int, { nullable: true })
  RegionId: number | null;

  @Column()
  @Field((type) => Date, { nullable: true })
  birth_date_cut: Date;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  special_ed: boolean;

  @Column()
  @Field((type) => String, { nullable: true })
  special_ed_options: string;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  enrollment_packet: boolean;

  @Column()
  @Field((type) => String, { nullable: true })
  grades: string;

  @ManyToOne(() => ApplicationRegion, (region) => region.schoolYears)
  @JoinColumn([{ name: 'RegionId', referencedColumnName: 'id' }])
  region: ApplicationRegion;

  @OneToMany(() => Resource, (resource) => resource.SchoolYear)
  @Field(() => [Resource], { nullable: true })
  Resources: Resource[];
}
