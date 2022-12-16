import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { StudentRecordFile } from './student-record-file.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "file_id, name, type, item1, item2, item3, year, is_new_upload_type, uploaded_by, signedUrl")')
@Entity('mth_file')
export class File extends BaseEntity {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  @PrimaryGeneratedColumn({ type: 'int', name: 'file_id' })
  file_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  type?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  item1?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  item2?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  item3?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  year?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  is_new_upload_type?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  uploaded_by?: number;

  @Field(() => String, { nullable: true })
  @Directive('@external')
  signedUrl?: string;

  @OneToMany(() => StudentRecordFile, (studentRecordFile) => studentRecordFile.File)
  @Field(() => [StudentRecordFile], { nullable: true })
  StudentRecordFiles: StudentRecordFile[];
}
