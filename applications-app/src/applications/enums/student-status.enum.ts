import { registerEnumType } from '@nestjs/graphql';

export enum StudentStatusEnum {
  PENDING = 0,
  ACTIVE = 1,
  APPLIED = 5,
  WITHDRAWN = 2,
  GRADUATED = 3,
}

registerEnumType(StudentStatusEnum, {
  name: 'StudentStatusEnum',
});
