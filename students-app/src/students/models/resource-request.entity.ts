import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ResourceRequestStatus } from '../enums';
import { Resource } from './resource.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "student_id, resource_id")')
@Entity('mth_resource_request')
export class ResourceRequest {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  student_id?: number;

  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  resource_id?: number;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  resource_level_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @IsIn([ResourceRequestStatus.REQUESTED])
  status?: string;

  @Column()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @ManyToOne(() => Student, (student) => student.ResourceRequests, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'student_id' }])
  @Field(() => Student, { nullable: true })
  Student: Student;

  @ManyToOne(() => Resource, (resource) => resource.ResourceRequests, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'resource_id' }])
  @Field(() => Resource, { nullable: true })
  Resource: Resource;
}
