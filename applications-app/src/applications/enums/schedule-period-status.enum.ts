import { registerEnumType } from '@nestjs/graphql';

export enum SchedulePeriodStatus {
  UPDATE_REQUESTED = 'UPDATE_REQUESTED',
}

registerEnumType(SchedulePeriodStatus, {
  name: 'SchedulePeriodStatusEnum',
});
