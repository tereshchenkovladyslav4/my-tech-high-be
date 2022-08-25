import { registerEnumType } from '@nestjs/graphql';

export enum YEAR_STATUS {
  NEW = 0,
  RETURNING = 1,
  TRANSFERRED = 2,
  SIBLING = 3,
}

registerEnumType(YEAR_STATUS, {
  name: 'YEAR_STATUS',
});
