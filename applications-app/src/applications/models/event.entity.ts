import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventType } from './event-type.entity';

@ObjectType()
@Entity('mth_event')
export class ApplicationEvent extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'event_id' })
  event_id?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', name: 'TypeId', nullable: true })
  TypeId?: number;

  @Field((type) => String, { nullable: true })
  @Column({ name: 'start_date', nullable: true })
  start_date?: string;

  @Field((type) => String, { nullable: true })
  @Column({ name: 'end_date', nullable: true })
  end_date?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  time?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  filter_grades?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  filter_program_year?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  filter_users?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  filter_school_of_enrollment?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  filter_other?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  filter_provider?: string;

  @Field((type) => String, { nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  created_date?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_date?: Date;

  @ManyToOne(() => EventType, (eventType) => eventType.Events, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'TypeId', referencedColumnName: 'event_type_id' })
  @Field(() => EventType, { nullable: true })
  EventType: EventType;
}
