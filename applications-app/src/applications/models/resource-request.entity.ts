import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ResourceRequestStatus } from '../enums';
import { Resource } from './resource.entity';
import { Student } from './student.entity';
import { ResourceLevel } from './resource-level.entity';

@InputType('resource_request')
@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "student_id, resource_id, resource_level_id, status, created_at, updated_at, Student, Resource, ResourceLevel")',
)
@Entity('mth_resource_request')
export class ResourceRequest {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryColumn()
  @Directive('@external')
  student_id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryColumn()
  @Directive('@external')
  resource_id?: number;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  resource_level_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @IsIn([ResourceRequestStatus.REQUESTED])
  @Directive('@external')
  status?: string;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  created_at?: Date;

  @Column()
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
    onUpdate: 'SET NULL',
  })
  @JoinColumn([{ name: 'resource_level_id', referencedColumnName: 'resource_level_id' }])
  @Field(() => ResourceLevel, { nullable: true })
  @Directive('@external')
  ResourceLevel: ResourceLevel;
}
