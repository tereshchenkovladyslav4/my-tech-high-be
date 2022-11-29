import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  school_year_id?: number;

  @Column({ type: 'date' })
  date_begin: string;

  @Column({ type: 'date' })
  date_end: string;

  @Column({ type: 'date' })
  date_reg_open: string;

  @Column({ type: 'date' })
  date_reg_close: string;

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
  midyear_application_open: string;

  @Column({ type: 'date' })
  midyear_application_close: string;

  @Column()
  first_sem_learning_logs_close: Date;

  @Column()
  re_enroll_notification?: number;

  @Column()
  midyear_application?: number;

  @Column('int', { name: 'RegionId', nullable: true })
  RegionId: number | null;

  @Column({ type: 'date' })
  birth_date_cut: string;

  @Column()
  special_ed: boolean;

  @Column()
  special_ed_options: string;

  @Column()
  enrollment_packet: boolean;

  @Column()
  grades: string;
}
