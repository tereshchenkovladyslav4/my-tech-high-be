import { registerEnumType } from '@nestjs/graphql';

export enum ResourceRequestStatus {
  REQUESTED = 'Requested',
}

registerEnumType(ResourceRequestStatus, {
  name: 'ResourceRequestStatus',
});
