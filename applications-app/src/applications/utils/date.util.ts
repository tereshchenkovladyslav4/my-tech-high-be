import * as Moment from 'moment-timezone';

export const showDate = (date: string | Date | undefined, format = 'MM/DD/YYYY'): string => {
  if (date) {
    return Moment(date).tz('UTC').format(format);
  }
  return '';
};
