import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserRegion } from './user-region.entity';
import { Role } from './role.entity';
import { Classes } from './classes.entity';

@InputType('users')
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
  @Field(() => String, { nullable: true })
  @Directive('@external')
  email?: string;

  @Column()
  password?: string;

  @Column()
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Column()
  @Field(() => String, { nullable: true })
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

  @ManyToOne(() => Role, (role) => role.level)
  @JoinColumn({ name: 'level', referencedColumnName: 'id' })
  role: Role;

  @OneToMany(() => Classes, (classes) => classes.primaryTeacher)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'primary_id' })
  classes: Classes[];
}
