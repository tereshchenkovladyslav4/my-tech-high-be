import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ApplicationUserRegion } from './user-region.entity';
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "user_id")')
@Entity({ name: 'core_users' })
export class User extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  user_id?: number;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  level?: number;

  @Column()
  updatedAt?: string;

  @OneToMany(() => ApplicationUserRegion, (userRegion) => userRegion.user)
  // @Field(() => [ApplicationUserRegion], { nullable: true })
  userRegion?: ApplicationUserRegion;
}
