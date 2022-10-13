import { Field, InputType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class EnrollmentPacketSubmissionInput {
  @Field()
  packet_id?: number;

  @Field({ nullable: true })
  @Length(1, 3)
  agrees_to_policy?: number;

  @Field({ nullable: true })
  @Length(1, 3)
  approves_enrollment?: number;

  @Field({ nullable: true })
  @Length(1, 3)
  photo_permission?: number;

  @Field({ nullable: true })
  @Length(1, 3)
  ferpa_agreement?: number;

  @Field({ nullable: true })
  @Length(1, 3)
  dir_permission?: number;

  @Field({ nullable: true })
  signature_name?: string;

  @Field({ nullable: true })
  signature_file_id?: number;
}
