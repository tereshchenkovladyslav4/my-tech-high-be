import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { REDUCE_FUNDS, SEMESTER_TYPE } from '../enums/period.enum';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@key(fields: "id, school_year_id, period, category, archived")')
@Entity({ name: 'mth_period' })
export class Period extends BaseEntity {
  @Column()
  @Field((type) => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  school_year_id: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  period: number;

  @Column()
  @Field((type) => String, { nullable: true })
  category: string;

  @Column()
  @Field((type) => String, { nullable: true })
  grade_level_min: string;

  @Column()
  @Field((type) => String, { nullable: true })
  grade_level_max: string;

  @Column()
  @Field((type) => REDUCE_FUNDS, { nullable: true })
  reduce_funds?: REDUCE_FUNDS;

  @Column()
  @Field((type) => Int, { nullable: true })
  price?: number;

  @Column()
  @IsEnum(SEMESTER_TYPE)
  @Field((type) => SEMESTER_TYPE, { nullable: true })
  semester?: SEMESTER_TYPE;

  @Column()
  @Field((type) => String, { nullable: true })
  message_semester?: string;

  @Column()
  @Field((type) => String, { nullable: true })
  message_period?: string;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  notify_semester?: boolean;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  notify_period?: boolean;

  @Column({ default: 0 })
  @Field((type) => Boolean, { nullable: true })
  archived?: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Periods)
  @JoinColumn([{ name: 'school_year_id', referencedColumnName: 'school_year_id' }])
  SchoolYear: SchoolYear;
}
