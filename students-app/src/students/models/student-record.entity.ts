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

  @Column({ type: 'int', name: 'RegionId', nullable: true })
  @Field(() => Int, { nullable: true })
  RegionId: number | null;

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

  @ManyToOne(() => Region, (region) => region.Records, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'RegionId', referencedColumnName: 'id' })
  @Field(() => Region, { nullable: true })
  Region: Region;

  @OneToMany(
    () => StudentRecordFile,
    (studentRecordFile) => studentRecordFile.StudentRecord,
  )
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
