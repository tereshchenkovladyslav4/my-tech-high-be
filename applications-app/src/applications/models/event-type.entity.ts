import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApplicationEvent } from './event.entity';
import { Region } from './region.entity';

@ObjectType()
@Entity('mth_event_type')
export class EventType extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'event_type_id' })
  event_type_id?: number;

  @Field((type) => Int, { nullable: true })
  @Column('int', { name: 'RegionId', nullable: true })
  RegionId: number | null;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  color?: string;

  @Field((type) => Int, { nullable: true })
  @Column('int', { name: 'priority', nullable: true })
  priority?: number;

  @Field((type) => Boolean, { nullable: true })
  @Column('tinyint', { name: 'archived', nullable: true })
  archived?: boolean;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;

  @OneToMany(() => ApplicationEvent, (eventType) => eventType.EventType)
  @Field(() => [ApplicationEvent], { nullable: true })
  Events: ApplicationEvent[];

  @ManyToOne(() => Region, (region) => region.EventTypes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'RegionId', referencedColumnName: 'id' })
  @Field(() => Region, { nullable: true })
  Region: Region;
}
