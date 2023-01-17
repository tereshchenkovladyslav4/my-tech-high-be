import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "person_id, user_id")')
@Entity({ name: 'mth_person' })
export class Person extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  person_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  user_id?: number;

  @Column()
  first_name?: string;

  @Column()
  last_name?: string;

  @Column()
  middle_name?: string;

  @Column()
  preferred_first_name?: string;

  @Column()
  preferred_last_name?: string;

  @Column()
  gender?: string;

  @Column()
  email?: string;

  @Column()
  date_of_birth?: Date;

  @OneToOne(() => User, (user) => user.user_id)
  user: User | null;
}
