import { Field, ID, ObjectType, Int, Directive } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { EnrollmentQuestions } from './enrollment-questions.entity';
@ObjectType()
@Directive('@key(fields: "id, tab_id")')
@Entity('mth_enrollment_question_group')
export class EnrollmentQuestionGroup extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  tab_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  group_name?: string;

  @Column()
  @Field(() => Int, { defaultValue: 0 })
  order: number;

  @OneToMany(
    (type) => EnrollmentQuestions,
    (enrollmentQuestion) => enrollmentQuestion.group_id,
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'group_id' })
  questions?: EnrollmentQuestions[];
}
