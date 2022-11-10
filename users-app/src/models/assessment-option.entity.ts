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
import { Assessment } from './assessment.entity';

@ObjectType()
@Directive('@key(fields: "option_id, AssessmentId, label, method, require_reason, reason, Assessment")')
@Directive('@extends')
@Entity({ name: 'mth_assessment_option' })
export class AssessmentOption extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'option_id' })
  @Directive('@external')
  option_id: number;

  @Column({ type: 'int', name: 'AssessmentId' })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  AssessmentId: number;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  label: string;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  method: string;

  @Column('tinyint', { name: 'require_reason', default: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  require_reason: boolean;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
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
  @Directive('@external')
  Assessment: Assessment;
}
