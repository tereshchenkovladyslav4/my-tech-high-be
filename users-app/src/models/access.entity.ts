import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserAccess } from './user-access.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'access' })
export class Access extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  name: string;

  @ManyToOne(() => UserAccess, (userAccess) => userAccess.accessDetail)
  @Field(() => UserAccess, { nullable: true })
  access: UserAccess;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
