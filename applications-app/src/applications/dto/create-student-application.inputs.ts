import { CreateAddressInput } from './new-address.inputs';
import { NewParentPacketContactInput } from './new-parent-packet-contact.inputs';
import { CreateStudentPacketInput } from './new-student-packet.inputs';

export type CreateStudentApplicationInput = {
  parent_id: number;
  school_year_id: number;
  studentApplication: CreateStudentPacketInput;
  referred_by?: string;
  meta?: string;
  address?: CreateAddressInput;
  packet?: NewParentPacketContactInput;
  midyear_application?: boolean;
  parent_person_id?: number;
};
