import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';
@ObjectType()
@Directive('@key(fields: "file_id, packet_id, mth_file_id")')
@Entity('mth_packet_file')
@Unique('packet_file_id', ['packet_id', 'mth_file_id'])
export class PacketFile extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  file_id?: number

  @Column()
  @Field(() => Int, { nullable: true })
  packet_id?: number
  
  @Column()
  @Field(() => Int, { nullable: true })
  mth_file_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  kind?: string;
}
