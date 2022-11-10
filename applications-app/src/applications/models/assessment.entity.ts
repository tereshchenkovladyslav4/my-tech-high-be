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
  OneToMany,
} from 'typeorm';
import { AssessmentOption } from './assessment-option.entity';
import { SchoolYear } from './schoolyear.entity';
import { StudentAssessmentOption } from './student-assessment-option.entity';

@ObjectType()
@Directive(
  '@key(fields: "assessment_id, SchoolYearId, test_name, grades, information, information, priority, is_archived, Options")',
)
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

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Assessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;

  @OneToMany(() => AssessmentOption, (assessment) => assessment.Assessment)
  @Field(() => [AssessmentOption], { nullable: true })
  Options: AssessmentOption[];

  @OneToMany(() => StudentAssessmentOption, (studentAssessmentOption) => studentAssessmentOption.Assessment)
  @Field(() => [StudentAssessmentOption], { nullable: true })
  StudentAssessments: StudentAssessmentOption[];
}
