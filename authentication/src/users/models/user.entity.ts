import { Directive, Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm'

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "user_id")')
@Entity({ name: 'core_users' })
export class User extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  user_id?: number

  @Column()
  @Field(() => String, { nullable: true })
  email?: string

  @Column()
  @Field(() => String, { nullable: true })
  firstName?: string

  @Column()
  @Field(() => String, { nullable: true })
  lastName?: string

  @Column()
  @Field(() => String, { nullable: true })
  password?: string

  @Column()
  @Field(() => Number, { nullable: true })
  level?: number

  @Column()
  @Field(() => String, { nullable: true })
  cookie?: string

  @Column()
  @Field(() => Date, { nullable: true })
  lastLogin?: Date

  @Column()
  @Field(() => String, { nullable: true })
  avatarUrl?: string

  @Column()
  @Field(() => String, { nullable: true })
  status?: string

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
