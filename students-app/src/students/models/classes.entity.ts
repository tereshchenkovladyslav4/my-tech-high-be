import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { MTHHomeroomStudent } from './homeroom-student.entity';
@ObjectType()
@Directive('@key(fields: "class_id,master_id,class_name,primary_id,addition_id,homeroom")')
@Entity('mth_classes')
export class MTHClasses extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  class_id?: number;

  @Column()
  @Field(() => Int)
  master_id: number;

  @Column()
  @Field(() => String)
  class_name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  primary_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  addition_id: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;

  @OneToMany((type) => MTHHomeroomStudent, (homeroom) => homeroom.teacher)
  @JoinColumn({ name: 'class_id', referencedColumnName: 'teacher_id' })
  @Field(() => [MTHHomeroomStudent], { nullable: true })
  homeroom: MTHHomeroomStudent[];
}
