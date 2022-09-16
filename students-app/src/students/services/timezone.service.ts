import { Injectable } from '@nestjs/common';
import * as Moment from 'moment';
import { MYSQL_DATE_FORMAT } from '../constants';

@Injectable()
export class TimezoneService {
  async timezoneOffset(region_id: number): Promise<number> {
    // -420 is UTCOffset for MST timezone
    // We will integrate timezone for every region
    return -420;
  }

  async getTimezoneDate(region_id: number): Promise<string> {
    const tzOffset = await this.timezoneOffset(region_id);
    const nowDate = Moment().utcOffset(tzOffset).format(MYSQL_DATE_FORMAT);
    return nowDate;
  }
}
