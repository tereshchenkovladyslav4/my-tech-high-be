import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceRequest } from '../models/resource-request.entity';
import { Pagination } from '../../paginate';
import { ResourceRequestsArgs } from '../dto/resource-requests.args';
import { ResourceFeature, StudentStatusEnum } from '../enums';

@Injectable()
export class ResourceRequestService {
  constructor(
    @InjectRepository(ResourceRequest)
    private readonly repo: Repository<ResourceRequest>,
  ) {}

  async find(args: ResourceRequestsArgs): Promise<Pagination<ResourceRequest>> {
    const { schoolYearId, skip, take, filter } = args;
    const qb = await this.repo
      .createQueryBuilder('resourceRequest')
      .leftJoinAndSelect('resourceRequest.Student', 'Student')
      .leftJoinAndSelect('Student.person', 'Person')
      .leftJoinAndSelect('resourceRequest.Resource', 'Resource')
      .leftJoinAndSelect('Student.parent', 'Parent')
      .leftJoinAndSelect('Student.status', 'StudentStatus', `StudentStatus.school_year_id = ${schoolYearId}`)
      .leftJoinAndSelect('Parent.person', 'ParentPerson')
      .leftJoinAndSelect('resourceRequest.ResourceLevel', 'ResourceLevel')
      .where(`Resource.SchoolYearId = ${schoolYearId}`);

    if (filter) {
      // TODO relations and courses filter
      const { studentStatuses, statuses, relations, features, types, resources, courses } = filter;
      if (studentStatuses?.includes(`${StudentStatusEnum.MID_YEAR}`)) {
        studentStatuses.splice(studentStatuses.indexOf(`${StudentStatusEnum.MID_YEAR}`), 1);
      }
      if (studentStatuses?.length) {
        qb.andWhere(
          `StudentStatus.school_year_id = ${schoolYearId} AND StudentStatus.status IN (${studentStatuses.join(',')})`,
        );
      }
      if (statuses?.length) {
        qb.andWhere(`resourceRequest.status IN ("${statuses.join('","')}")`);
      }
      if (features?.includes(`${ResourceFeature.LIMIT}`) && !features?.includes(`${ResourceFeature.FAMILY_RESOURCE}`)) {
        qb.andWhere('Resource.resource_limit > 0 OR ResourceLevel.limit > 0');
      }
      if (features?.includes(`${ResourceFeature.FAMILY_RESOURCE}`) && !features?.includes(`${ResourceFeature.LIMIT}`)) {
        qb.andWhere('Resource.family_resource = true');
      }
      if (types?.length) {
        qb.andWhere(`Resource.subtitle IN ("${types.join('","')}")`);
      }
      if (resources?.length) {
        qb.andWhere(`Resource.resource_id IN ("${resources.join('","')}")`);
      }
    }

    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    return new Pagination<ResourceRequest>({
      results,
      total,
    });
  }
}
