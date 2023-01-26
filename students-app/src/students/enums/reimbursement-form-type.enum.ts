import { registerEnumType } from '@nestjs/graphql';

export enum ReimbursementFormType {
  CUSTOM_BUILT = 'CUSTOM_BUILT',
  TECHNOLOGY = 'TECHNOLOGY',
  THIRD_PARTY_PROVIDER = 'THIRD_PARTY_PROVIDER',
  SUPPLEMENTAL = 'SUPPLEMENTAL',
  REQUIRED_SOFTWARE = 'REQUIRED_SOFTWARE',
}

registerEnumType(ReimbursementFormType, {
  name: 'ReimbursementFormType',
});
