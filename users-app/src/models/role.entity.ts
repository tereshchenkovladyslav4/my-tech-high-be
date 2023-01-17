import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  // @Directive('@external')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  level: number;

  @ManyToOne(() => User, (user) => user.level)
  @Field(() => User, { nullable: true })
  role: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
