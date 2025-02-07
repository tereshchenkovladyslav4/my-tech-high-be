import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EventType } from './event-type.entity';

@InputType('event')
@ObjectType()
@Entity('mth_event')
export class ApplicationEvent extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'event_id' })
  event_id?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', name: 'TypeId', nullable: true })
  TypeId?: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', name: 'all_day', nullable: true })
  all_day?: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', name: 'has_rsvp', nullable: true, default: 0 })
  has_rsvp?: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', name: 'start_date', nullable: true })
  start_date?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', name: 'end_date', nullable: true })
  end_date?: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_grades?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_program_year?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_users?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_school_of_enrollment?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_other?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_provider?: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;

  @ManyToOne(() => EventType, (eventType) => eventType.Events, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'TypeId', referencedColumnName: 'event_type_id' })
  @Field(() => EventType, { nullable: true })
  EventType: EventType;
}
