import { registerEnumType } from '@nestjs/graphql';

export enum AssignmentFilterStatus {
  UNGRADED = 'ungraded',
  SHOW_ALL = 'showAll',
}

registerEnumType(AssignmentFilterStatus, {
  name: 'AssignmentFilterStatusEnum',
});
