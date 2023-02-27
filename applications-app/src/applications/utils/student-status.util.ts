import { StudentStatusEnum } from '../enums';
import * as Moment from 'moment';
import { StudentStatus } from '../models/student-status.entity';

export const studentStatusText = (studentStatusData: StudentStatus | undefined, showDate = false): string => {
  const dateStr = showDate ? ` ${Moment(studentStatusData?.date_updated).format('MM/DD/YYYY')}` : '';
  switch (studentStatusData?.status) {
    case StudentStatusEnum.APPLIED: {
      return `Applied${dateStr}`;
    }
    case StudentStatusEnum.REAPPLIED: {
      return `Applied (re-apply)${dateStr}`;
    }
    case StudentStatusEnum.ACCEPTED: {
      return `Accepted${dateStr}`;
    }
    case StudentStatusEnum.PENDING: {
      return `Pending${dateStr}`;
    }
    case StudentStatusEnum.ACTIVE: {
      return `Active${dateStr}`;
    }
    case StudentStatusEnum.WITHDRAWN: {
      return `Withdrawn${dateStr}`;
    }
  }

  return '';
};
