import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../models/region.entity';
import { CreateRegionInput } from '../dto/new-region.inputs';
import { CloneRegionInput } from '../dto/clone-region.inputs';
import { UserRegionService } from './user-region.service';
import { EmailTemplatesService } from './email-templates.service';
import { UsersService } from './users.service';
import { SchoolYearService } from './schoolyear.service';
import { omit } from 'lodash';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private repo: Repository<Region>,
    private userRegionService: UserRegionService,
    private emailTemplatesService: EmailTemplatesService,
    private usersService: UsersService,
    private schoolYearService: SchoolYearService,
  ) {}

  async findOneById(region_id: number): Promise<Region> {
    return this.repo.findOne({
      where: { id: region_id },
      relations: ['schoolYears', 'region'],
    });
  }

  async findOneByName(name: string): Promise<Region> {
    return this.repo.findOne({
      where: { name },
      relations: ['schoolYears', 'region'],
    });
  }

  async create(region: CreateRegionInput): Promise<Region> {
    return this.repo.save({
      name: region.name,
      program: region.program,
    });
  }

  async clone(cloneRegion: CloneRegionInput, userEmail: string): Promise<Region> {
    try {
      const isRegionExist = await this.findOneByName(cloneRegion.new_region_name);

      if (isRegionExist && isRegionExist.id) {
        throw new BadRequestException('Region name already exists!');
      }

      let region = isRegionExist;
      if (!region) {
        region = await this.create({
          name: cloneRegion.new_region_name,
          program: 'MTH',
        });
      }

      const user = await this.usersService.findOneByEmail(userEmail);

      const hasUserRegion = region && region.region;
      const user_id = (user && user.user_id) || 8032;

      if (!hasUserRegion || !hasUserRegion.user_id || hasUserRegion.user_id !== user_id)
        await this.userRegionService.createUserRegion({ user_id, region_id: [region.id] });

      const region_to_be_cloned = await this.findOneById(cloneRegion.to_be_clone_region_id);
      const region_school_year =
        region_to_be_cloned && region_to_be_cloned.schoolYears && region_to_be_cloned.schoolYears[0];

      if (region_school_year) {
        const RegionId = region.id;
        const payload = omit(region_school_year, 'school_year_id');
        const school_year = await this.schoolYearService.create({ ...payload, RegionId });

        if (school_year && school_year.school_year_id) {
          const region_email_templates = await this.emailTemplatesService.findByRegionAndSchoolYear(
            region_school_year.RegionId,
            region_school_year.school_year_id,
          );

          const school_year_id = school_year.school_year_id;
          await Promise.all(
            region_email_templates.map(
              async (region_email_template) =>
                await this.emailTemplatesService.create({
                  ...region_email_template,
                  school_year_id,
                  ...{ region_id: RegionId },
                }),
            ),
          );
        }
      }

      return region;
    } catch (error) {
      return error;
    }
  }
}
