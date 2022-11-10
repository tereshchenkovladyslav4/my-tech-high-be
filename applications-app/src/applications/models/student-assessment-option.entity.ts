import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
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
import { AssessmentOption } from './assessment-option.entity';
import { Assessment } from './assessment.entity';

@ObjectType()
@Directive('@key(fields: "assessment_option_id")')
@Entity({ name: 'mth_student_assessment_option' })
export class StudentAssessmentOption extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'assessment_option_id' })
  assessment_option_id: number;

  @Column({ type: 'int', name: 'StudentId' })
  @Field(() => Int, { nullable: true })
  StudentId: number;

  @Column({ type: 'int', name: 'AssessmentId' })
  @Field(() => Int, { nullable: true })
  AssessmentId: number;

  @Column({ type: 'int', name: 'OptionId' })
  @Field(() => Int, { nullable: true })
  OptionId: number;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  out_text: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Assessment, (assessment) => assessment.StudentAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'AssessmentId', referencedColumnName: 'assessment_id' }])
  @Field(() => Assessment, { nullable: true })
  Assessment: Assessment;

  @ManyToOne(() => AssessmentOption, (assessmentOption) => assessmentOption.StudentAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OptionId', referencedColumnName: 'option_id' }])
  @Field(() => AssessmentOption, { nullable: true })
  AssessmentOption: AssessmentOption;
}
