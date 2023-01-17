import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'user_roles' })
export class UserRole extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  user_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  role_id: number;

  @ManyToOne(() => Role, (role) => role.role, { onDelete: 'CASCADE' })
  @Field(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  roleDetail: Role;

  @ManyToOne(() => User, (user) => user.level, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
