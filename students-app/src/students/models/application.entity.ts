import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Student } from './student.entity';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "application_id, student_id")')
@Entity('mth_application')
export class Application extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  application_id?: number;

  @Column()
  @Directive('@external')
  student_id?: number;

  @Column()
  school_year_id?: number;

  @Column()
  status?: string;

  @Column()
  city_of_residence?: string;

  @Column()
  date_started?: Date;

  @Column()
  date_submitted?: Date;

  @Column()
  date_accepted?: Date;
}
