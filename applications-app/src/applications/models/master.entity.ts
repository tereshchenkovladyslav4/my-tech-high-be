import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, OneToMany } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Classes } from './classes.entity';
@InputType('master')
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

  @Column()
  @Field(() => String, { nullable: true })
  instructions?: string;

  @OneToMany(() => Classes, (classes) => classes.Master)
  @Field(() => [Classes], { nullable: true })
  Classes: Classes[];

  @OneToMany(() => Assignment, (assignment) => assignment.Master)
  @Field(() => [Assignment], { nullable: true })
  Assignments: Assignment[];

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;
}
