import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';

@ObjectType()
@Directive('@key(fields: "title_id, subject_id, name, is_active, deleted, Subject")')
@Entity('mth_title')
export class Title {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  title_id?: number;

  @Column()
  @Field(() => ID, { nullable: true })
  subject_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  min_grade: string;

  @Column()
  @Field(() => String, { nullable: true })
  max_grade: string;

  @Column()
  @Field(() => String, { nullable: true })
  min_alt_grade: string;

  @Column()
  @Field(() => String, { nullable: true })
  max_alt_grade: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  diploma_seeking_path: string;

  @Column()
  @Field(() => String, { nullable: true })
  reduce_funds: string;

  @Column('decimal', {
    name: 'price',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  price: number | null;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  reduce_funds_notification: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  custom_built_description: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  subject_notification: string;

  @Column('tinyint', { name: 'always_unlock', default: false })
  @Field(() => Boolean, { nullable: true })
  always_unlock: boolean;

  @Column('tinyint', { name: 'custom_built', default: false })
  @Field(() => Boolean, { nullable: true })
  custom_built: boolean;

  @Column('tinyint', { name: 'third_party_provider', default: false })
  @Field(() => Boolean, { nullable: true })
  third_party_provider: boolean;

  @Column('tinyint', { name: 'split_enrollment', default: false })
  @Field(() => Boolean, { nullable: true })
  split_enrollment: boolean;

  @Column('tinyint', { name: 'software_reimbursement', default: false })
  @Field(() => Boolean, { nullable: true })
  software_reimbursement: boolean;

  @Column('tinyint', { name: 'display_notification', default: false })
  @Field(() => Boolean, { nullable: true })
  display_notification: boolean;

  @Column('tinyint', { name: 'launchpad_course', default: false })
  @Field(() => Boolean, { nullable: true })
  launchpad_course: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  course_id?: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  state_course_codes: string;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @ManyToOne(() => Subject, (subject) => subject.Titles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'subject_id', referencedColumnName: 'subject_id' }])
  @Field(() => Subject, { nullable: true })
  Subject: Subject;
}
