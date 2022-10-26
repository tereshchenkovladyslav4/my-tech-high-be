import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { Course } from './course.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "title_id, subject_id, name, min_grade, max_grade, min_alt_grade, max_alt_grade, diploma_seeking_path, reduce_funds, price, reduce_funds_notification, custom_built_description, subject_notification, always_unlock, custom_built, third_party_provider, split_enrollment, software_reimbursement, display_notification, launchpad_course, course_id, state_course_codes, allow_request, is_active, deleted, Subject, Courses")',
)
@Entity('mth_title')
export class Title {
  @Column('int', { name: 'title_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  title_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  subject_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  min_grade: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  max_grade: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  min_alt_grade: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  max_alt_grade: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  diploma_seeking_path: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reduce_funds: string;

  @Column('decimal', {
    name: 'price',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  @Directive('@external')
  price: number | null;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reduce_funds_notification: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  custom_built_description: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  subject_notification: string;

  @Column('tinyint', { name: 'always_unlock', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  always_unlock: boolean;

  @Column('tinyint', { name: 'custom_built', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  custom_built: boolean;

  @Column('tinyint', { name: 'third_party_provider', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  third_party_provider: boolean;

  @Column('tinyint', { name: 'split_enrollment', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  split_enrollment: boolean;

  @Column('tinyint', { name: 'software_reimbursement', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  software_reimbursement: boolean;

  @Column('tinyint', { name: 'display_notification', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  display_notification: boolean;

  @Column('tinyint', { name: 'launchpad_course', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  launchpad_course: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  course_id?: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  state_course_codes: string;

  @Column('tinyint', { name: 'allow_request', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  allow_request: boolean;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_active: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  deleted: boolean;

  @ManyToOne(() => Subject, (subject) => subject.Titles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'subject_id', referencedColumnName: 'subject_id' }])
  @Field(() => Subject, { nullable: true })
  @Directive('@external')
  Subject: Subject;

  @ManyToMany(() => Course, (course) => course.Titles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Course], { nullable: true })
  @Directive('@external')
  Courses: Course[];
}
