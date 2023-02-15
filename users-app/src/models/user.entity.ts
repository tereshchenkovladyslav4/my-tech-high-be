import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ParentUser } from './parent.entity';
import { Person } from './person.entity';
import { Role } from './role.entity';
import { UserAccess } from './user-access.entity';
import { UserRegion } from './user-region.entity';

@ObjectType()
@Directive('@key(fields: "user_id, email, first_name, last_name")')
@Entity({ name: 'core_users' })
export class User extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  user_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  email?: string;

  @Column()
  @Field(() => String, { nullable: true })
  first_name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  last_name?: string;

  @Column()
  @Field(() => String)
  password?: string;

  @Column({ default: '0' })
  @Field(() => String)
  status?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  cookie?: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  last_login?: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  red_announcements?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  red_notifications?: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  masquerade?: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  auth_token?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  can_emulate?: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  level?: number;

  @ManyToOne(() => Role, (role) => role.level)
  @Field(() => Role, { nullable: true })
  @JoinColumn({ name: 'level', referencedColumnName: 'id' })
  role: Role;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.user)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  @Field(() => [UserRegion], { nullable: true })
  userRegion?: UserRegion[];

  @OneToMany(() => UserAccess, (userAccess) => userAccess.user)
  @Field(() => [UserAccess], { nullable: true })
  userAccess: UserAccess;

  @OneToMany(() => ParentUser, (parent) => parent.studentDetail)
  @Field(() => [ParentUser], { nullable: true })
  student: ParentUser;

  @OneToOne(() => Person, (person) => person.user_id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  @Field(() => Person, { nullable: true })
  profile: Person;
}
