import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { ResourceSubtitle } from 'src/enums';
import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ResourceLevel } from './resource-level.entity';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "resource_id, SchoolYearId, title, image, subtitle, price, website, grades, std_username_format, std_user_name, std_password, detail, priority, is_active, resource_limit, add_resource_level, family_resource, allow_request, deleted, ResourceLevels, SchoolYear")',
)
@Entity({ name: 'mth_resource_settings' })
export class Resource extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
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
  @IsIn([ResourceSubtitle.NONE, ResourceSubtitle.INCLUDED, ResourceSubtitle.PRICE])
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

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  std_username_format: string;

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

  @OneToMany(() => ResourceLevel, (resourceLevel) => resourceLevel.Resource)
  @Field(() => [ResourceLevel], { nullable: true })
  @Directive('@external')
  ResourceLevels: ResourceLevel[];

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Resources, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  @Field(() => SchoolYear, { nullable: true })
  @Directive('@external')
  SchoolYear: SchoolYear;
}
