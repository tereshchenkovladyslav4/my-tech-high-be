import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { SchoolYear } from './schoolyear.entity';
import { Title } from './title.entity';

@InputType('state_code')
@ObjectType()
@Directive('@key(fields: "state_codes_id, TitleId, SchoolYearId, title_name, state_code, grade, teacher, subject")')
@Entity({ name: 'mth_state_codes' })
export class StateCodes extends BaseEntity {
  @Column('int', { name: 'state_codes_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  state_codes_id: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Column('int', { name: 'TitleId', nullable: true })
  @Field(() => Int, { nullable: true })
  TitleId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  title_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  state_code: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  grade: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  teacher: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  subject: string;

  @ManyToOne(() => Title, (title) => title.StateCodes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'TitleId', referencedColumnName: 'title_id' }])
  Title: Title;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.StateCodes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  SchoolYear: SchoolYear;
}
