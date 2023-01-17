import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { SchoolPartnerInput } from '../dto/school-partner.input';
import { UpdateSchoolPartnerInput } from '../dto/update-school-partner.input';
import { AuthGuard } from '../guards/auth.guard';
import { SchoolPartner } from '../../models/school-partner.entity';
import { SchoolPartnerService } from '../services/school-partner.service';
import { SchoolPartnerArgs } from '../dto/school-partner-args';

@Resolver(() => SchoolPartner)
export class SchoolPartnerResolver {
  constructor(private schoolPartnerService: SchoolPartnerService) {}

  @Query(() => [SchoolPartner])
  async getSchoolsOfEnrollment(): Promise<SchoolPartner[]> {
    return this.schoolPartnerService.findAll();
  }

  @Query(() => [SchoolPartner])
  async getSchoolsOfEnrollmentByRegion(
    @Args('schoolPartnerArgs')
    schoolPartnerArgs: SchoolPartnerArgs,
  ): Promise<SchoolPartner[]> {
    return this.schoolPartnerService.findByRegion(schoolPartnerArgs);
  }

  @Mutation(() => SchoolPartner, { name: 'createSchoolPartner' })
  @UseGuards(new AuthGuard())
  async createSchoolPartner(
    @Args('schoolPartnerInput')
    schoolPartnerInput: SchoolPartnerInput,
  ): Promise<SchoolPartner> {
    return await this.schoolPartnerService.createSchoolPartner(schoolPartnerInput);
  }

  @Mutation(() => SchoolPartner, { name: 'updateSchoolPartner' })
  @UseGuards(new AuthGuard())
  async updateSchoolPartner(
    @Args('updateSchoolPartnerInput')
    updateSchoolPartnerInput: UpdateSchoolPartnerInput,
  ): Promise<SchoolPartner> {
    const { school_partner_id } = updateSchoolPartnerInput;
    const schoolPartner = await this.schoolPartnerService.findOneById(school_partner_id);

    if (!schoolPartner) {
      throw new UnauthorizedException();
    }

    return await this.schoolPartnerService.updateSchoolPartner(schoolPartner, updateSchoolPartnerInput);
  }

  @Mutation(() => SchoolPartner, { name: 'toggleSchoolPartnerArchive' })
  @UseGuards(new AuthGuard())
  async toggleSchoolPartnerArchive(
    @Args('schoolPartnerId')
    schoolPartnerId: number,
  ): Promise<SchoolPartner> {
    const schoolPartner = await this.schoolPartnerService.findOneById(schoolPartnerId);

    if (!schoolPartner) {
      throw new UnauthorizedException();
    }

    return await this.schoolPartnerService.toggleSchoolPartnerArchive(schoolPartner);
  }
}
