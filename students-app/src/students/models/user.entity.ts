import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Student } from './student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "user_id")')
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
  email?: string;

  @Column()
  password?: string;

  @Column({ default: '0' })
  status?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  level?: number;

  @Column()
  updatedAt?: string;
}
