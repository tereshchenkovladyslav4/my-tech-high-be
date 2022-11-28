import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Classes } from './classes.entity';
@ObjectType()
@Directive('@key(fields: "master_id")')
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

  @OneToMany(() => Classes, (classes) => classes.master)
  @JoinColumn({ name: 'master_id', referencedColumnName: 'master_id' })
  @Field(() => [Classes], { nullable: true })
  masterClasses: Classes[];

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;
}
