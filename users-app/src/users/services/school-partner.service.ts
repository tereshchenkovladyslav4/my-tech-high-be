import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, getConnection } from 'typeorm';
import { SchoolPartnerInput } from '../dto/school-partner.input';
import { UpdateSchoolPartnerInput } from '../dto/update-school-partner.input';
import { SchoolPartner } from '../../models/school-partner.entity';
import { SchoolPartnerArgs } from '../dto/school-partner-args';

@Injectable()
export class SchoolPartnerService {
  constructor(
    @InjectRepository(SchoolPartner)
    private schoolPartnerRepository: Repository<SchoolPartner>,
  ) {}

  findBySchoolYear(school_year_id) {
    return this.schoolPartnerRepository.find({ where: { school_year_id } });
  }

  findAll(): Promise<SchoolPartner[]> {
    return this.schoolPartnerRepository.find();
  }

  async createSchoolPartner(schoolPartnerInput: SchoolPartnerInput): Promise<SchoolPartner> {
    let schoolPartner: SchoolPartner;

    await this.schoolPartnerRepository
      .save(schoolPartnerInput)
      .then((schoolPartnerData) => (schoolPartner = schoolPartnerData));

    return schoolPartner;
  }

  async updateSchoolPartner(
    school: SchoolPartner,
    schoolPartnerInput: UpdateSchoolPartnerInput,
  ): Promise<SchoolPartner> {
    const { abbreviation, name, photo } = schoolPartnerInput;

    const currSchool = await createQueryBuilder(SchoolPartner)
      .where('`SchoolPartner`.school_partner_id = :schoolPartnerId', {
        schoolPartnerId: school.school_partner_id,
      })
      .printSql()
      .getOne();

    await getConnection()
      .createQueryBuilder()
      .update(SchoolPartner)
      .set({
        abbreviation,
        name,
        photo,
      })
      .where('school_partner_id = :id', { id: currSchool.school_partner_id })
      .execute();

    return currSchool;
  }

  findOneById(school_partner_id: number): Promise<SchoolPartner> {
    return this.schoolPartnerRepository.findOne(school_partner_id);
  }

  findByRegion(schoolPartnerArgs: SchoolPartnerArgs): Promise<SchoolPartner[]> {
    const { region_id, sort, school_year_id } = schoolPartnerArgs;
    if (sort !== null) {
      const { column, direction } = sort;
      return this.schoolPartnerRepository.find({
        order: {
          [column]: direction,
        },
        where: {
          region_id,
          school_year_id,
        },
      });
    } else {
      return this.schoolPartnerRepository.find({
        where: {
          region_id,
        },
      });
    }
  }

  async toggleSchoolPartnerArchive(school: SchoolPartner): Promise<SchoolPartner> {
    const currSchool = await createQueryBuilder(SchoolPartner)
      .where('`SchoolPartner`.school_partner_id = :schoolPartnerId', {
        schoolPartnerId: school.school_partner_id,
      })
      .printSql()
      .getOne();

    await getConnection()
      .createQueryBuilder()
      .update(SchoolPartner)
      .set({
        active: currSchool.active === 0 ? 1 : 0,
      })
      .where('school_partner_id = :id', { id: currSchool.school_partner_id })
      .execute();

    return currSchool;
  }
}
