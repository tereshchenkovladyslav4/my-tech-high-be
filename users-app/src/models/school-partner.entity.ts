import { Field, ID, Int, ObjectType, } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Region } from './region.entity';

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

  @Column()
  @Field((type) => Int, { nullable: true })
  region_id: number;

  @OneToOne(() => Region, (region) => region.id)
  @Field(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id', referencedColumnName: 'id' })
  region: Region;

}
