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
import { User } from './user.entity';

@ObjectType()
@Entity('announcement')
export class Announcement extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'announcement_id' })
  announcement_id?: number;

  @Field((type) => Int, { nullable: true })
  @Column('int', { name: 'UserId', nullable: true })
  UserId: number | null;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_grades?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  filter_users?: string;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  date?: Date;

  @ManyToOne(() => User, (user) => user.Announcements, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId', referencedColumnName: 'user_id' })
  @Field(() => User, { nullable: true })
  User: User;
}
