import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { REDUCE_FUNDS, SEMESTER_TYPE } from '../enums';
import { SchoolYear } from './schoolyear.entity';
import { Subject } from './subject.entity';
import { Provider } from './provider.entity';

@ObjectType()
@Directive(
  '@key(fields: "id, school_year_id, period, diploma_seeking_path, category, min_grade, max_grade, semester, message_period, notify_period, archived, Subjects, Providers")',
)
@Entity({ name: 'mth_period' })
export class Period extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  school_year_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  period: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  diploma_seeking_path: string;

  @Column()
  @Field(() => String, { nullable: true })
  category: string;

  @Column()
  @Field(() => Int, { nullable: true })
  min_grade: number;

  @Column()
  @Field(() => Int, { nullable: true })
  max_grade: number;

  @Column({
    type: 'enum',
    enum: REDUCE_FUNDS,
    comment: 'NONE: NONE(default), SUPPLEMENTAL: SUPPLEMENTAL, TECHNOLOGY: TECHNOLOGY',
  })
  @Field(() => REDUCE_FUNDS, { nullable: true })
  reduce_funds?: REDUCE_FUNDS;

  @Column()
  @Field(() => Number, { nullable: true })
  price?: number;

  @Column({
    type: 'enum',
    enum: SEMESTER_TYPE,
    comment: 'NONE: NONE(default), PERIOD: PERIOD, SUBJECT: SUBJECT',
  })
  @Field(() => SEMESTER_TYPE, { nullable: true })
  semester?: SEMESTER_TYPE;

  @Column()
  @Field(() => String, { nullable: true })
  message_semester?: string;

  @Column()
  @Field(() => String, { nullable: true })
  message_period?: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  notify_semester?: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true })
  notify_period?: boolean;

  @Column({ default: 0 })
  @Field(() => Boolean, { nullable: true })
  archived?: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Periods)
  @JoinColumn([{ name: 'school_year_id', referencedColumnName: 'school_year_id' }])
  SchoolYear: SchoolYear;

  @ManyToMany(() => Subject, (subject) => subject.Periods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Subject], { nullable: true })
  Subjects: Subject[];

  @ManyToMany(() => Provider, (provider) => provider.Periods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Provider], { nullable: true })
  Providers: Provider[];
}
