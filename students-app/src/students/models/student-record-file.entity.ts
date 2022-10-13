import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { File } from './file.entity';
import { StudentRecord } from './student-record.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "record_file_id")')
@Entity('mth_student_record_file')
export class StudentRecordFile extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'record_file_id' })
  record_file_id: number;

  @Column({ type: 'int', name: 'RecordId', nullable: true })
  @Field(() => Int, { nullable: true })
  RecordId: number | null;

  @Column({ type: 'int', name: 'FileId', nullable: true })
  @Field(() => Int, { nullable: true })
  FileId: number | null;

  @Column({ type: 'varchar', name: 'file_kind', nullable: true })
  @Field(() => String, { nullable: true })
  file_kind: string;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;

  @ManyToOne(() => StudentRecord, (studentRecord) => studentRecord.StudentRecordFiles, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'RecordId', referencedColumnName: 'record_id' })
  @Field(() => StudentRecord, { nullable: true })
  StudentRecord: StudentRecord;

  @ManyToOne(() => File, (file) => file.StudentRecordFiles, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'FileId', referencedColumnName: 'file_id' })
  @Field(() => File, { nullable: true })
  File: File;
}
