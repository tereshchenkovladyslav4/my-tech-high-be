import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  school_year_id?: number;

  @Column()
  date_begin: Date;

  @Column()
  date_end: Date;

  @Column()
  date_reg_open: Date;

  @Column()
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
  RegionId: number | null;

  @Column()
  birth_date_cut: Date;

  @Column()
  special_ed: boolean;

  @Column()
  special_ed_options: string;

  @Column()
  enrollment_packet: boolean;

  @Column()
  grades: string;
}
