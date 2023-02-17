import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { UserRegion } from './user-region.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "user_id, email, first_name, last_name")')
@Entity({ name: 'core_users' })
export class User extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  user_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  email?: string;

  @Column()
  @Directive('@external')
  @Field(() => String, { nullable: true })
  first_name?: string;

  @Column()
  @Directive('@external')
  @Field(() => String, { nullable: true })
  last_name?: string;

  @Column()
  password?: string;

  @Column()
  level?: number;

  @Column()
  cookie?: string;

  @Column()
  lastLogin?: Date;

  @Column()
  avatarUrl?: string;

  @Column()
  status?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.user)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  userRegion?: UserRegion[];
}
