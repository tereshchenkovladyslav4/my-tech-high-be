import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Announcement } from './announcement.entity';
import { UserRegion } from './user-region.entity';
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "user_id, email")')
@Entity({ name: 'core_users' })
export class User extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  @Directive('@external')
  user_id?: number;

  @Column()
  @Field(() => String)
  @Directive('@external')
  email?: string;

  @Column()
  password?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  level?: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.user)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  // @Field(() => [UserRegion], { nullable: true })
  userRegions?: UserRegion[];
}
