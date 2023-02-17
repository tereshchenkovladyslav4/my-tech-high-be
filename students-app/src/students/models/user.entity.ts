import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn, OneToMany } from 'typeorm';
import { Classes } from './classes.entity';
import { Student } from './student.entity';
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
  user_id: number;

  @Field((type) => [Student])
  students?: Student[];

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  email?: string;

  @Column()
  password?: string;

  @Column({ default: '0' })
  status?: string;

  @Column()
  @Directive('@external')
  @Field(() => String, { nullable: true })
  first_name?: string;

  @Column()
  @Directive('@external')
  @Field(() => String, { nullable: true })
  last_name?: string;

  @Column()
  level?: number;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.user)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  userRegion?: UserRegion[];

  @OneToMany(() => Classes, (classes) => classes.PrimaryTeacher)
  @Field(() => [Classes], { nullable: true })
  UserClasses: Classes[];
}
