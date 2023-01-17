import { AuthGuard } from './../../guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { SchoolDistrictService } from '../../services/schoolDistrict.service';
import { SchoolDistrict } from '../../../models/school-district.entity';

@Resolver(() => SchoolDistrict)
export class SchoolDistrictsResolver {
  constructor(private schoolDistrictService: SchoolDistrictService) {}

  @Query(() => [SchoolDistrict], { name: 'schoolDistrict', nullable: true })
  @UseGuards(new AuthGuard())
  getSchoolDistricts(@Args({ name: 'id', type: () => ID }) id: number): Promise<SchoolDistrict[]> {
    return this.schoolDistrictService.findSchoolDistrictsById(id);
  }
}
