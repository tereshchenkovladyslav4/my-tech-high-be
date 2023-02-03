import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { EnrollmentQuestionGroup } from './enrollment-question-group.entity';
@ObjectType()
@Directive('@key(fields: "id")')
@Entity('mth_enrollment_question_tab')
export class EnrollmentQuestionTab extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  tab_name?: string;

  @Column()
  @Field(() => Boolean, { defaultValue: true })
  is_active: boolean;

  @Column()
  @Field(() => Int, { nullable: true })
  region_id?: number;

  @OneToMany(() => EnrollmentQuestionGroup, (enrollmentQuestionGroup) => enrollmentQuestionGroup.tab_id)
  groups?: EnrollmentQuestionGroup[];

  @Column()
  @Field(() => Int, { nullable: true })
  school_year_id?: number;

  @Column()
  @Field(() => Boolean, { nullable: true })
  mid_year?: boolean;
}
