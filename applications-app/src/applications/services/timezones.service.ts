import { Injectable } from '@nestjs/common';
import * as Moment from 'moment';
import { MYSQL_DATE_FORMAT } from '../constants';

@Injectable()
export class TimezonesService {
  /* eslint-disable @typescript-eslint/no-unused-vars*/
  async timezoneOffset(region_id: number): Promise<number> {
    // -420 is UTCOffset for MST timezone
    // We will integrate timezone for every region
    return -420;
  }

  async getTimezoneDate(regionId: number, date?: Date): Promise<string> {
    const tzOffset = await this.timezoneOffset(regionId);
    const nowDate = Moment(date || '')
      .utcOffset(tzOffset)
      .format(MYSQL_DATE_FORMAT);
    return nowDate;
  }
}
