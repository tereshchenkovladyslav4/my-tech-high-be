import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Packet } from './packet.entity';

@ObjectType()
@Directive('@key(fields: "packet_email_id")')
@Entity('mth_packet_email')
export class PacketEmail extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  packet_email_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  packet_id?: number;

  @Column()
  @Field(() => String)
  subject: string;

  @Column()
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => String, { nullable: true })
  from_email: string;

  @Column()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @ManyToOne((type) => Packet)
  @JoinColumn({
    name: 'packet_id',
    referencedColumnName: 'packet_id',
  })
  packet: Packet;
}
