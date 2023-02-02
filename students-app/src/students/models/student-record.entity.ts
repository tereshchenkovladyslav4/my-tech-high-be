import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Region } from './region.entity';
import { SchoolYear } from './schoolyear.entity';
import { StudentRecordFile } from './student-record-file.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "record_id")')
@Entity('mth_student_record')
export class StudentRecord extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'record_id' })
  record_id: number;

  @Column({ type: 'int', name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  StudentId: number | null;

  @Column({ type: 'int', name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number | null;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;

  @ManyToOne(() => Student, (student) => student.Records, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'StudentId', referencedColumnName: 'student_id' })
  @Field(() => Student, { nullable: true })
  Student: Student;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.StudentRecords, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SchoolYearId', referencedColumnName: 'school_year_id' })
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;

  @OneToMany(() => StudentRecordFile, (studentRecordFile) => studentRecordFile.StudentRecord)
  @Field(() => [StudentRecordFile], { nullable: true })
  StudentRecordFiles: StudentRecordFile[];
}

@ObjectType()
export class StudentRecordPagination {
  @Field((type) => [StudentRecord])
  results?: StudentRecord[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
