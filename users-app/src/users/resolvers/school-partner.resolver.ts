import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Query,
  Resolver,
  ResolveReference,
  ResolveField,
  Parent,
	Mutation,
	Context,
} from '@nestjs/graphql';
import { SchoolPartnerInput } from '../dto/school-partner.input';
import { UpdateSchoolPartnerInput } from '../dto/update-school-partner.input';
import { AuthGuard } from '../guards/auth.guard';
import { SchoolPartner } from '../../models/school-partner.entity';
import { SchoolPartnerService } from '../services/school-partner.service';

@Resolver((of) => SchoolPartner)
export class SchoolPartnerResolver {
  constructor(private schoolYearsService: SchoolPartnerService) {}

  @Query((returns) => [SchoolPartner])
  async getSchoolsOfEnrollment(): Promise<SchoolPartner[]> {
    return this.schoolYearsService.findAll();
  }

  @Query((returns) => [SchoolPartner])
  async getSchoolsOfEnrollmentByRegion(
    @Args({ name: 'region_id', type: () => ID }) region_id: number,
  ): Promise<SchoolPartner[]> {
    return this.schoolYearsService.findByRegion(region_id);
  }

	@Mutation(() => SchoolPartner, { name: 'createSchoolPartner' })
  @UseGuards(new AuthGuard())
  async createSchoolPartner(
    @Args('schoolPartnerInput')
    schoolPartnerInput: SchoolPartnerInput,
  ): Promise<SchoolPartner> {
    return await this.schoolYearsService.createSchoolPartner(schoolPartnerInput)
  }

  @Mutation(() => SchoolPartner, { name: 'updateSchoolPartner' })
  @UseGuards(new AuthGuard())
  async updateSchoolPartner(
    @Args('updateSchoolPartnerInput')
    updateSchoolPartnerInput: UpdateSchoolPartnerInput,
  ): Promise<SchoolPartner> {

    const { school_partner_id } = updateSchoolPartnerInput;
    const schoolPartner = await this.schoolYearsService.findOneById(school_partner_id);

    if (!schoolPartner) {
      throw new UnauthorizedException();
    }

    return await this.schoolYearsService.updateSchoolPartner(
      schoolPartner,
      updateSchoolPartnerInput,
    );
    
  }

  @Mutation(() => SchoolPartner, { name: 'toggleSchoolPartnerArchive' })
  @UseGuards(new AuthGuard())
  async toggleSchoolPartnerArchive(
    @Args('schoolPartnerId')
    schoolPartnerId: number,
  ): Promise<SchoolPartner> {

    const schoolPartner = await this.schoolYearsService.findOneById(schoolPartnerId);

    if (!schoolPartner) {
      throw new UnauthorizedException();
    }

    return await this.schoolYearsService.toggleSchoolPartnerArchive(
      schoolPartner
    );
    
  }
}
