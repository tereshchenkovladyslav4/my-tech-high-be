import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResourceRequestStatus } from '../enums';
import { Resource } from './resource.entity';
import { Student } from './student.entity';
import { ResourceLevel } from './resource-level.entity';
import { ResourceRequestEmail } from './resource-request-email.entity';
import { Course } from './course.entity';

@InputType('resource_request')
@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, student_id, resource_id, resource_level_id, course_id, status, username, password, created_at, updated_at, Student, Resource, ResourceLevel, Course")',
)
@Entity('mth_resource_request')
export class ResourceRequest {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  student_id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  resource_id?: number;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  resource_level_id?: number;

  @Column('int', { nullable: true })
  @Field(() => String, { nullable: true })
  @IsIn([ResourceRequestStatus.REQUESTED])
  @Directive('@external')
  status?: string;

  @Column('int')
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  course_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  username: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  password: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  created_at?: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  updated_at?: Date;

  @ManyToOne(() => Student, (student) => student.ResourceRequests, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'student_id' }])
  @Field(() => Student, { nullable: true })
  @Directive('@external')
  Student: Student;

  @ManyToOne(() => Resource, (resource) => resource.ResourceRequests, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'resource_id' }])
  @Field(() => Resource, { nullable: true })
  @Directive('@external')
  Resource: Resource;

  @ManyToOne(() => ResourceLevel, (resourceLevel) => resourceLevel.ResourceRequests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_level_id', referencedColumnName: 'resource_level_id' }])
  @Field(() => ResourceLevel, { nullable: true })
  @Directive('@external')
  ResourceLevel: ResourceLevel;

  @OneToMany(() => ResourceRequestEmail, (resourceRequestEmail) => resourceRequestEmail.ResourceRequest)
  @Field(() => [ResourceRequestEmail], { nullable: true })
  ResourceRequestEmails: ResourceRequestEmail[];

  @ManyToOne(() => Course, (course) => course.ResourceRequests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  @Field(() => Course, { nullable: true })
  @Directive('@external')
  Course: Course;
}
