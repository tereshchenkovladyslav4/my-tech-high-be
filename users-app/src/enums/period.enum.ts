import { registerEnumType } from '@nestjs/graphql';

export enum REDUCE_FUNDS {
  NONE = 'NONE',
  SUPPLEMENTAL = 'SUPPLEMENTAL',
  TECHNOLOGY = 'TECHNOLOGY',
}

export enum SEMESTER_TYPE {
  NONE = 'NONE',
  PERIOD = 'PERIOD',
  SUBJECT = 'SUBJECT',
}

registerEnumType(REDUCE_FUNDS, {
  name: 'REDUCE_FUNDS',
});

registerEnumType(SEMESTER_TYPE, {
  name: 'SEMESTER_TYPE',
});
