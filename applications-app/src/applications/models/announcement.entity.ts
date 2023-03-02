import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Region } from './region.entity';
import { UserAnnouncement } from './user-announcement.entity';

@InputType('announcement')
@ObjectType()
@Entity('announcement')
export class Announcement extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'announcement_id' })
  announcement_id?: number;

  @Field(() => Int, { nullable: true })
  @Column('int', { name: 'RegionId', nullable: true })
  RegionId: number | null;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  posted_by?: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  schedule_time?: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  @Column('text', { name: 'body', nullable: true })
  body?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_grades?: string;

  @Field(() => Boolean, { nullable: true })
  @Column('tinyint', { name: 'isArchived', nullable: true })
  isArchived?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_users?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_program_years?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_school_partners?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_others?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_providers?: string;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  date?: Date;

  @OneToMany(() => UserAnnouncement, (userAnnouncement) => userAnnouncement.Announcement)
  @Field(() => [UserAnnouncement], { nullable: true })
  UserAnnouncements: UserAnnouncement[];

  @ManyToOne(() => Region, (region) => region.Announcements, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'RegionId', referencedColumnName: 'id' })
  @Field(() => Region, { nullable: true })
  Region: Region;
}
