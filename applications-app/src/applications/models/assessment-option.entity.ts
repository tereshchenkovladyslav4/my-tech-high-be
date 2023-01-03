import { Directive, Field, ObjectType, Int, InputType } from '@nestjs/graphql';
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
import { Assessment } from './assessment.entity';
import { StudentAssessmentOption } from './student-assessment-option.entity';

@InputType('assessment_option')
@ObjectType()
@Directive('@key(fields: "option_id, AssessmentId, label, method, require_reason, reason, Assessment")')
@Entity({ name: 'mth_assessment_option' })
export class AssessmentOption extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'option_id' })
  option_id: number;

  @Column({ type: 'int', name: 'AssessmentId' })
  @Field(() => Int, { nullable: true })
  AssessmentId: number;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  label: string;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  method: string;

  @Column('tinyint', { name: 'require_reason', default: true })
  @Field(() => Boolean, { nullable: true })
  require_reason: boolean;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  reason: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Assessment, (assessment) => assessment.Options, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'AssessmentId', referencedColumnName: 'assessment_id' }])
  @Field(() => Assessment, { nullable: true })
  Assessment: Assessment;

  @OneToMany(() => StudentAssessmentOption, (studentAssessmentOption) => studentAssessmentOption.AssessmentOption)
  @Field(() => [StudentAssessmentOption], { nullable: true })
  StudentAssessments: StudentAssessmentOption[];
}
