import { registerEnumType } from '@nestjs/graphql';

export enum ReduceFunds {
  NONE = 'NONE',
  TECHNOLOGY = 'TECHNOLOGY',
  SUPPLEMENTAL = 'SUPPLEMENTAL',
}

registerEnumType(ReduceFunds, {
  name: 'ReduceFunds',
});
