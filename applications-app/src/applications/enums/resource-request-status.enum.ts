import { registerEnumType } from '@nestjs/graphql';

export enum ResourceRequestStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  PENDING_REMOVAL = 'PENDING_REMOVAL',
  REMOVED = 'REMOVED',
  WAITLIST = 'WAITLIST',
}

registerEnumType(ResourceRequestStatus, {
  name: 'ResourceRequestStatus',
});
