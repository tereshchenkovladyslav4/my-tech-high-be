import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AssessmentOption } from './assessment-option.entity';

@ObjectType()
@Directive(
  '@key(fields: "assessment_id, SchoolYearId, test_name, grades, information, information, priority, is_archived, Options")',
)
@Directive('@extends')
@Entity({ name: 'mth_assessment' })
export class Assessment extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'assessment_id' })
  @Directive('@external')
  assessment_id: number;

  @Column({ type: 'int', name: 'SchoolYearId' })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SchoolYearId: number;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  test_name: string;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grades: string;

  @Column({ type: 'text' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  information: string;

  @Column('int', { name: 'priority', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  priority: number;

  @Column('tinyint', { name: 'is_archived', default: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_archived: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => AssessmentOption, (assessment) => assessment.Assessment)
  @Field(() => [AssessmentOption], { nullable: true })
  @Directive('@external')
  Options: AssessmentOption[];
}
