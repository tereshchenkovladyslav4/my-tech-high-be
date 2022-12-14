import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive(
  '@key(fields: "id,master_id, type, question, options, default_question, custom_question, required, can_upload")',
)
@Entity('mth_learning_log_questions')
export class LearningLogQuestion extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('int', { name: 'master_id', nullable: true })
  @Field(() => Int, { nullable: true })
  master_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  type?: string;

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
  custom_question: boolean;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  required: boolean;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  can_upload: boolean;
}
