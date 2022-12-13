import { registerEnumType } from '@nestjs/graphql';

export enum StudentStatusEnum {
  PENDING = 0,
  ACTIVE = 1,
  WITHDRAWN = 2,
  GRADUATED = 3,
  APPLIED = 5,
  REAPPLIED = 7,
}

registerEnumType(StudentStatusEnum, {
  name: 'StudentStatusEnum',
});
