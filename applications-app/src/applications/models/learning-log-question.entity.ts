import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive(
  '@key(fields: "id,assignment_id, type, slug, parent_slug, question, options, default_question, required, can_upload, grade_specific, grades")',
)
@Entity('mth_learning_log_questions')
export class LearningLogQuestion extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('int', { name: 'assignment_id' })
  @Field(() => Int, { nullable: true })
  assignment_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  type?: string;

  @Column()
  @Field(() => String, { nullable: true })
  slug?: string;

  @Column()
  @Field(() => String, { nullable: true })
  parent_slug?: string;

  @Column()
  @Field(() => String, { nullable: true })
  question?: string;

  @Column()
  @Field(() => String, { nullable: true })
  options?: string;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  default_question: boolean;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  required: boolean;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  can_upload: boolean;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  grade_specific: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  grades: string;

  @Column()
  @Field(() => Int)
  page: number;
}
