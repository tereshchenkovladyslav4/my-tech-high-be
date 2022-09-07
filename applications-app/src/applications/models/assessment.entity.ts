import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@key(fields: "assessment_id")')
@Entity({ name: 'mth_assessment' })
export class Assessment extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'assessment_id' })
  assessment_id: number;

  @Column({ type: 'int', name: 'SchoolYearId' })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  test_name: string;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  grades: string;

  @Column({ type: 'text' })
  @Field(() => String, { nullable: true })
  information: string;

  @Column('int', { name: 'priority', nullable: true })
  @Field(() => Int, { nullable: true })
  priority: number;

  @Column('tinyint', { name: 'is_archived', default: true })
  @Field(() => Boolean, { nullable: true })
  is_archived: boolean;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  option1: string;

  @Column({ type: 'text' })
  @Field(() => String, { nullable: true })
  option_list: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Assessments)
  @JoinColumn([
    { name: 'SchoolYearId', referencedColumnName: 'school_year_id' },
  ])
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;
}
