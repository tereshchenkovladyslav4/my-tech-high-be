import { Directive, Field, ID, ObjectType, } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Entity('school_partner')
export class SchoolPartner extends BaseEntity {
  @Column()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  school_partner_id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
	@Field(() => String)
  abbreviation: string;

	@Column()
	@Field(() => String, {nullable: true})
  photo?: string;

  @Column()
	@Field(() => Number)
  active: number;

}
