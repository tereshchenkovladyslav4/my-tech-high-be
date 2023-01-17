import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Access } from './access.entity';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'user_access' })
export class UserAccess extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  access_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  user_id: number;

  @ManyToOne(() => Access, (access) => access.access, { onDelete: 'CASCADE' })
  @Field(() => Access, { nullable: true })
  @JoinColumn({ name: 'access_id' })
  accessDetail: Access;

  @ManyToOne(() => User, (user) => user.userAccess, { onDelete: 'CASCADE' })
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
