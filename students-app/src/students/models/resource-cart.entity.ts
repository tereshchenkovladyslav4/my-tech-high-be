import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Resource } from './resource.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "student_id, resource_id")')
@Entity('mth_resource_cart')
export class ResourceCart {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  student_id?: number;

  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  resource_id?: number;

  @Column()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @ManyToOne(() => Student, (student) => student.HiddenResources, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'student_id' }])
  @Field(() => Student, { nullable: true })
  Student: Student;

  @ManyToOne(() => Resource, (resource) => resource.HiddenStudents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'resource_id' }])
  @Field(() => Resource, { nullable: true })
  Resource: Resource;
}
