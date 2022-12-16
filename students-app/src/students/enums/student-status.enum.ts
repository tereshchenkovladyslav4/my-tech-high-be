import { registerEnumType } from '@nestjs/graphql';

export enum StudentStatusEnum {
  PENDING = 0,
  ACTIVE = 1,
  WITHDRAWN = 2,
  GRADUATED = 3,
  APPLIED = 5,
  ACCEPTED = 6,
  REAPPLIED = 7,
  /**
   * Packet is deleted by Admin
   */
  DELETED = 8,
}

registerEnumType(StudentStatusEnum, {
  name: 'StudentStatusEnum',
});
