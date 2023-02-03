import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { EnrollmentQuestionTab } from './enrollment-question-tab.entity';
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

  @ManyToOne(() => EnrollmentQuestionTab, (enrollmentQuestionTab) => enrollmentQuestionTab.groups)
  tab?: EnrollmentQuestionTab;

  @OneToMany(() => EnrollmentQuestions, (enrollmentQuestion) => enrollmentQuestion.group_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'group_id' })
  questions?: EnrollmentQuestions[];
}
