import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ResourceSubtitle } from '../enums';
import { StudentHiddenResource } from './student-hidden-resource.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "resource_id, SchoolYearId, title, image, subtitle, price, website, grades, std_user_name, std_password, detail, priority, is_active, resource_limit, add_resource_level, resource_level, family_resource, allow_request, deleted")',
)
@Entity({ name: 'mth_resource_settings' })
export class Resource extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  resource_id?: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SchoolYearId: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  image: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  @IsIn([
    ResourceSubtitle.NONE,
    ResourceSubtitle.INCLUDED,
    ResourceSubtitle.PRICE,
  ])
  subtitle: string;

  @Column('decimal', {
    name: 'price',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  @Directive('@external')
  price: number | null;

  @Column('varchar', { length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  website: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grades: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  std_user_name: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  std_password: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  detail: string;

  @Column('int', { name: 'priority', nullable: true })
  @Directive('@external')
  @Field(() => Int, { nullable: true })
  priority: number | null;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_active: boolean;

  @Column('int', { name: 'resource_limit', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  resource_limit: number | null;

  @Column('tinyint', { name: 'add_resource_level', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  add_resource_level: boolean;

  @Column({ name: 'resource_level', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  resource_level: string;

  @Column('tinyint', { name: 'family_resource', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  family_resource: boolean;

  @Column('tinyint', { name: 'allow_request', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  allow_request: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  deleted: boolean;

  @Field(() => Boolean, { nullable: true })
  HiddenByStudent: boolean;

  @OneToMany(
    () => StudentHiddenResource,
    (studentHiddenResource) => studentHiddenResource.Resource,
  )
  @Field(() => [StudentHiddenResource], { nullable: true })
  HiddenStudents: StudentHiddenResource[];
}
