import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@InputType('schedule_email')
@ObjectType()
@Directive('@key(fields: "schedule_email_id")')
@Entity('mth_schedule_email')
export class ScheduleEmail extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  schedule_email_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  schedule_id: number;

  @Column()
  @Field(() => String)
  subject: string;

  @Column('text', { name: 'body', nullable: true })
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => String, { nullable: true })
  from_email: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  template_name: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.ScheduleEmails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'schedule_id',
    referencedColumnName: 'schedule_id',
  })
  Schedule: Schedule;
}
