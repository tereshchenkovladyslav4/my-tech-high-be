import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceRequestStatus } from '../enums';
import { Resource } from './resource.entity';
import { Student } from './student.entity';
import { ResourceLevel } from './resource-level.entity';

@ObjectType()
@Directive(
  '@key(fields: "id, student_id, resource_id, resource_level_id, status, created_at, updated_at, Student, Resource, ResourceLevel")',
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

  @ManyToOne(() => ResourceLevel, (resourceLevel) => resourceLevel.ResourceRequests, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn([{ name: 'resource_level_id', referencedColumnName: 'resource_level_id' }])
  @Field(() => ResourceLevel, { nullable: true })
  ResourceLevel: ResourceLevel;
}
