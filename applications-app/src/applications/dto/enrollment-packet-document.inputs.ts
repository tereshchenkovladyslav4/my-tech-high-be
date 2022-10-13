import { Field, InputType, Int } from '@nestjs/graphql';
import { DocumentItemInput } from './document-item.inputs';
@InputType()
export class EnrollmentPacketDocumentInput {
  @Field((type) => Int)
  packet_id?: number;

  @Field((type) => [DocumentItemInput], { defaultValue: [] })
  documents?: DocumentItemInput[];
}
