import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "file_id, name, type, item1, item2, item3, year, is_new_upload_type, uploaded_by, signedUrl")')
@Entity('mth_file')
export class File extends BaseEntity {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  file_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  type?: string;

  @Column('varchar', { length: 1000 })
  @Field(() => String, { nullable: true })
  item1?: string;

  @Column()
  @Field(() => String, { nullable: true })
  item2?: string;

  @Column()
  @Field(() => String, { nullable: true })
  item3?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  year?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  is_new_upload_type?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  uploaded_by?: number;

  @Field(() => String, { nullable: true })
  signedUrl?: string;
}
