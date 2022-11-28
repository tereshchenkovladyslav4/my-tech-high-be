import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CHECKLIST_STATUS } from '../enums';
import { SchoolYear } from './schoolyear.entity';
@ObjectType()
@Directive('@key(fields: "id,checklist_id,region_id,school_year_id,subject,goal")')
@Entity('mth_checklist')
export class Checklist extends BaseEntity {
  @Column('int', { name: 'id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int)
  region_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  checklist_id: string | null;

  @Column()
  @Field(() => Int, { nullable: true })
  school_year_id: number | null;

  @Column()
  @Field(() => Int, { nullable: true })
  grade: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  subject: string | null;

  @Column()
  @Field(() => String, { nullable: true })
  goal: string | null;

  @Column({ type: 'enum', enum: CHECKLIST_STATUS })
  @Field(() => String, { nullable: true })
  @IsIn([CHECKLIST_STATUS.SUBJECT_CHECKLIST, CHECKLIST_STATUS.INDEPENDENT_CHECKLIST])
  status: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;

  // @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Checklist, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  // SchoolYear: SchoolYear;
}
