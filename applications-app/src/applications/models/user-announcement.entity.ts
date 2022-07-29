import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Announcement } from './announcement.entity';
import { ApplicationRegion } from './region.entity';
import { User } from './user.entity';

@ObjectType()
@Entity('user_announcement')
export class UserAnnouncement extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Field((type) => Int, { nullable: true })
  @Column('int', { name: 'AnnouncementId', nullable: true })
  AnnouncementId: number | null;

  @Field((type) => Int, { nullable: true })
  @Column()
  user_id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  status?: string;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  emailed?: boolean;

  @ManyToOne(
    () => Announcement,
    (announcement) => announcement.UserAnnouncements,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'AnnouncementId',
    referencedColumnName: 'announcement_id',
  })
  @Field(() => Announcement, { nullable: true })
  Announcement: Announcement;
}
