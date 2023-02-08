import { UpdateRegionInput } from '../../dto/region/update-region.input';
import { CreateRegionInput } from '../../dto/region/create-region.input';
import { Region } from '../../../models/region.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import * as Moment from 'moment';
import { MYSQL_DATE_FORMAT } from 'src/constants';
import { EmailCategoryEnum } from 'src/enums';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async timezoneOffset(region_id: number): Promise<number> {
    // -420 is UTCOffset for MST timezone
    // We will integrate timezone for every region
    return -420;
  }

  async getTimezoneDate(region_id: number): Promise<string> {
    const tzOffset = await this.timezoneOffset(region_id);
    return Moment().utcOffset(tzOffset).format(MYSQL_DATE_FORMAT);
  }

  async findRegionById(region_id: number): Promise<Region> {
    const result = await this.regionRepository.findOne({
      where: {
        id: region_id,
      },
      relations: ['region', 'SchoolYears', 'SchoolYears.SchoolPartners', 'SchoolYears.ScheduleBuilder'],
    });
    const now = await this.getTimezoneDate(region_id);
    result.SchoolYears.map((item) => {
      item.IsCurrentYear = item.date_begin <= now && item.date_end >= now;
    });
    return result;
  }

  getAllRegions(): Promise<Region[]> {
    return this.regionRepository.find();
  }

  async createRegion(createRegionInput: CreateRegionInput): Promise<Region> {
    const data = this.regionRepository.create(createRegionInput);
    return await this.regionRepository.save(data);
  }

  async updateRegion(updateRegionInput: UpdateRegionInput): Promise<any> {
    if (updateRegionInput.county_array) {
      const countyArray = JSON.parse(updateRegionInput.county_array);
      let values = '';
      for (let i = 0; i < countyArray.length; i++) {
        if (i == 0) values += `("${countyArray[i].county_name}", ${updateRegionInput.id})`;
        else values += `, ("${countyArray[i].county_name}", ${updateRegionInput.id})`;
      }

      if (values != '') {
        await this.regionRepository.query(`DELETE FROM infocenter.county WHERE Region_id = ${updateRegionInput.id}; `);
        await this.regionRepository.query(`INSERT INTO infocenter.county (county_name, Region_id) VALUES ${values} `);
      }
    }

    if (updateRegionInput.school_district_array) {
      const schoolDistrictArray = JSON.parse(updateRegionInput.school_district_array);
      let values = '';
      for (let i = 0; i < schoolDistrictArray.length; i++) {
        if (i == 0)
          values += `("${schoolDistrictArray[i].school_district_name}", "${schoolDistrictArray[i].school_district_code}", ${updateRegionInput.id})`;
        else
          values += `, ("${schoolDistrictArray[i].school_district_name}", "${schoolDistrictArray[i].school_district_code}", ${updateRegionInput.id})`;
      }

      if (values != '') {
        await this.regionRepository.query(
          `DELETE FROM infocenter.school_district WHERE Region_id = ${updateRegionInput.id};`,
        );
        await this.regionRepository.query(
          `INSERT INTO infocenter.school_district (school_district_name, school_district_code, Region_id) VALUES ${values}`,
        );
      }
    }
    const data = {
      name: updateRegionInput.name,
      program: updateRegionInput.program,
      state_logo: updateRegionInput.state_logo,
      county_file_name: updateRegionInput.county_file_name,
      county_file_path: updateRegionInput.county_file_path,
      school_district_file_name: updateRegionInput.school_district_file_name,
      school_district_file_path: updateRegionInput.school_district_file_path,
      application_deadline_num_days: updateRegionInput.application_deadline_num_days,
      enrollment_packet_deadline_num_days: updateRegionInput.enrollment_packet_deadline_num_days,
      withdraw_deadline_num_days: updateRegionInput.withdraw_deadline_num_days,
      resource_confirm_details: updateRegionInput.resource_confirm_details,
    };
    Object.keys(data).forEach((key) => {
      if (key != 'state_logo' && !data[key]) {
        delete data[key];
      }
    });
    const res = await this.regionRepository.update(updateRegionInput.id, data);
    if (res.affected > 0) {
      return this.findRegionById(updateRegionInput.id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }

  async removeRegionById(region_id: number): Promise<string> {
    const data = await this.regionRepository.delete(region_id);
    if (data.affected > 0) {
      return 'Region Removed';
    } else {
      return 'Region with this ID does not exist';
    }
  }

  async removeCountyInfoByRegionId(region_id: number): Promise<string> {
    await this.regionRepository.query(`DELETE FROM infocenter.county WHERE Region_id = ${region_id};`);

    let attachmentId = '';
    let fileId = '';
    const getRegionNameResponse = await this.regionRepository.query(
      `SELECT county_file_path AS filePath FROM infocenter.region WHERE id = ${region_id}`,
    );

    await this.regionRepository.query(
      `UPDATE infocenter.region SET county_file_name = '', county_file_path = '' WHERE id = ${region_id};`,
    );

    getRegionNameResponse.map((item) => {
      attachmentId = decodeURI(item.filePath.substr(53));
    });

    const getFileIdResponse = await this.regionRepository.query(
      `SELECT MAX(file_id) AS fileId FROM infocenter.mth_file WHERE item1 = '${attachmentId}'`,
    );
    getFileIdResponse.map((item) => {
      fileId = item.fileId;
    });
    return fileId;
  }

  async removeSchoolDistrictInfoByRegionId(region_id: number): Promise<string> {
    await this.regionRepository.query(`DELETE FROM infocenter.school_district WHERE Region_id = ${region_id};`);

    let attachmentId = '';
    let fileId = '';
    const getRegionNameResponse = await this.regionRepository.query(
      `SELECT school_district_file_path AS filePath FROM infocenter.region WHERE id = ${region_id}`,
    );

    await this.regionRepository.query(
      `UPDATE infocenter.region SET school_district_file_name = '', school_district_file_path = '' WHERE id = ${region_id};`,
    );

    getRegionNameResponse.map((item) => {
      attachmentId = decodeURI(item.filePath.substr(53));
    });

    const getFileIdResponse = await this.regionRepository.query(
      `SELECT MAX(file_id) AS fileId FROM infocenter.mth_file WHERE item1 = '${attachmentId}'`,
    );
    getFileIdResponse.map((item) => {
      fileId = item.fileId;
    });
    return fileId;
  }

  async saveRegionDeadlines(region_id: number, deadline: number, category: string): Promise<any> {
    if (category == EmailCategoryEnum.APPLICATIONS)
      return await getConnection()
        .createQueryBuilder()
        .update(Region)
        .set({
          application_deadline_num_days: deadline,
        })
        .where('id = :id', { id: region_id })
        .execute();
    else if (category == EmailCategoryEnum.WITHDRAWAL)
      return await getConnection()
        .createQueryBuilder()
        .update(Region)
        .set({
          withdraw_deadline_num_days: deadline,
        })
        .where('id = :id', { id: region_id })
        .execute();
    else
      return await getConnection()
        .createQueryBuilder()
        .update(Region)
        .set({
          enrollment_packet_deadline_num_days: deadline,
        })
        .where('id = :id', { id: region_id })
        .execute();
  }
}
