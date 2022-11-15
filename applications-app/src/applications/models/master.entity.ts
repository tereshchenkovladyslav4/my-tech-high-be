import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
@ObjectType()
@Directive('@key(fields: "master_id,school_year_id,master_name")')
@Entity('mth_master')
export class Master extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  master_id?: number;

  @Column()
  @Field(() => Int)
  school_year_id: number;

  @Column()
  @Field(() => String)
  master_name: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;
}
