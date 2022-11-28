import { registerEnumType } from '@nestjs/graphql';

export enum SchedulePeriodStatus {
  UPDATE_REQUESTED = 'UPDATE_REQUESTED',
  UPDATE_REQUIRED = 'UPDATE_REQUIRED',
  RESUBMITTED = 'RESUBMITTED',
}

registerEnumType(SchedulePeriodStatus, {
  name: 'SchedulePeriodStatusEnum',
});
