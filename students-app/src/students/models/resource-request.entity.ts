import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResourceRequestStatus } from '../enums';
import { Resource } from './resource.entity';
import { Student } from './student.entity';
import { ResourceLevel } from './resource-level.entity';
import { Course } from './course.entity';

@ObjectType()
@Directive(
  '@key(fields: "id, student_id, resource_id, resource_level_id, course_id, status, username, password, created_at, updated_at, Student, Resource, ResourceLevel, Course")',
)
@Entity('mth_resource_request')
export class ResourceRequest {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  student_id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  resource_id?: number;

  @Column('int')
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  resource_level_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @IsIn([ResourceRequestStatus.REQUESTED])
  status?: string;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  course_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  username: string;

  @Column()
  @Field(() => String, { nullable: true })
  password: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @UpdateDateColumn()
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

  @ManyToOne(() => ResourceLevel, (resourceLevel) => resourceLevel.ResourceRequests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_level_id', referencedColumnName: 'resource_level_id' }])
  @Field(() => ResourceLevel, { nullable: true })
  ResourceLevel: ResourceLevel;

  @ManyToOne(() => Course, (course) => course.ResourceRequests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  @Field(() => Course, { nullable: true })
  Course: Course;
}
