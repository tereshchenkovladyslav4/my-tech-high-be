import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ResourceRequest } from '../models/resource-request.entity';
import { Pagination } from '../../paginate';
import { ResourceRequestsArgs } from '../dto/resource-requests.args';
import { ResourceFeature, ResourceRequestStatus, StudentStatusEnum } from '../enums';
import { ResourceRequestsActionInput } from '../dto/resource-requests-action.input';
import { UserRegion } from '../models/user-region.entity';
import { EmailResourceRequestsInput } from '../dto/email-resource-requests.input';
import { EmailsService } from './emails.service';
import { ResourceRequestEmailsService } from './resource-request-emails.service';
import { UserRegionService } from './user-region.service';
import { ResourceRequestEmail } from '../models/resource-request-email.entity';
import { UpdateResourceRequestInput } from '../dto/update-resource-request.inputs';
import { ResourceService } from './resource.service';

@Injectable()
export class ResourceRequestService {
  constructor(
    @InjectRepository(ResourceRequest)
    private readonly repo: Repository<ResourceRequest>,
    private sesEmailService: EmailsService,
    private resourceRequestEmailsService: ResourceRequestEmailsService,
    private userRegionService: UserRegionService,
    private resourceService: ResourceService,
  ) {}

  async find(args: ResourceRequestsArgs): Promise<Pagination<ResourceRequest>> {
    const { schoolYearId, skip, take, sort, filter, search } = args;
    const qb = await this.repo
      .createQueryBuilder('resourceRequest')
      .leftJoinAndSelect('resourceRequest.Student', 'Student')
      .leftJoinAndSelect('Student.person', 'Person')
      .leftJoinAndSelect('resourceRequest.Resource', 'Resource')
      .leftJoinAndSelect('Resource.ResourceLevels', 'ResourceLevels')
      .leftJoinAndSelect('Student.parent', 'Parent')
      .leftJoinAndSelect('Student.applications', 'applications')
      .leftJoinAndSelect('Student.status', 'StudentStatus', `StudentStatus.school_year_id = ${schoolYearId}`)
      .leftJoinAndSelect('Student.grade_levels', 'GradeLevels', `GradeLevels.school_year_id = ${schoolYearId}`)
      .leftJoinAndSelect('Parent.person', 'ParentPerson')
      .leftJoinAndSelect('resourceRequest.ResourceLevel', 'ResourceLevel')
      .leftJoinAndSelect('resourceRequest.ResourceRequestEmails', 'ResourceRequestEmails')
      .where(`Resource.SchoolYearId = ${schoolYearId}`);

    if (filter) {
      // TODO relations and courses filter
      const { studentStatuses, statuses, features, types, resources } = filter;
      if (studentStatuses?.length) {
        const hasMidYear = studentStatuses?.includes(`${StudentStatusEnum.MID_YEAR}`);
        if (hasMidYear) studentStatuses.splice(studentStatuses.indexOf(`${StudentStatusEnum.MID_YEAR}`), 1);
        if (studentStatuses?.length > 0 && hasMidYear) {
          qb.andWhere(
            `StudentStatus.school_year_id = ${schoolYearId} AND StudentStatus.status IN (${studentStatuses.join(',')})`,
          );
        } else if (studentStatuses?.length > 0 && !hasMidYear) {
          qb.andWhere(
            `StudentStatus.school_year_id = ${schoolYearId} AND StudentStatus.status IN (${studentStatuses.join(
              ',',
            )}) AND (applications.midyear_application IS NULL OR applications.midyear_application = 0)`,
          );
        } else if (!(studentStatuses?.length > 0) && hasMidYear) {
          qb.andWhere('applications.midyear_application = 1');
        }
      }
      if (statuses?.length) {
        const hasPendingRemoval = statuses?.includes(`${ResourceRequestStatus.PENDING_REMOVAL}`);
        if (hasPendingRemoval) statuses.splice(statuses.indexOf(`${ResourceRequestStatus.PENDING_REMOVAL}`), 1);
        if (statuses.length > 0 && hasPendingRemoval) {
          qb.andWhere(
            `(resourceRequest.status IN ("${statuses.join('","')}") OR (StudentStatus.status = ${
              StudentStatusEnum.WITHDRAWN
            } AND resourceRequest.status <> '${ResourceRequestStatus.REMOVED}') )`,
          );
        } else if (statuses.length > 0 && !hasPendingRemoval) {
          qb.andWhere(`resourceRequest.status IN ("${statuses.join('","')}")`);
        } else if (statuses.length == 0 && hasPendingRemoval) {
          qb.andWhere(
            `StudentStatus.status = ${StudentStatusEnum.WITHDRAWN} AND resourceRequest.status <> '${ResourceRequestStatus.REMOVED}'`,
          );
        }
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

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub.where('Person.first_name like :text', { text: `%${search}%` });
          sub.orWhere('Person.last_name like :text', { text: `%${search}%` });
          sub.orWhere('Person.email like :text', { text: `%${search}%` });
        }),
      );
    }

    if (sort) {
      const [sortBy, sortOrder] = sort.split('|');
      switch (sortBy) {
        case 'created_at': {
          qb.orderBy('resourceRequest.created_at', sortOrder === 'asc' ? 'DESC' : 'ASC');
          break;
        }
        case 'lastname': {
          qb.orderBy('Person.last_name', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'firstname': {
          qb.orderBy('Person.first_name', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'grade': {
          qb.orderBy('GradeLevels.grade_level', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'vendor': {
          qb.orderBy('Resource.title', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'email': {
          qb.orderBy('Person.email', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'status': {
          qb.orderBy('resourceRequest.status', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'cost': {
          // TODO
          qb.orderBy('Resource.subtitle', sortOrder === 'asc' ? 'ASC' : 'DESC');
          qb.addOrderBy('Resource.price', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        default: {
          qb.orderBy('ResourceRequestEmails.created_at', 'DESC');
          break;
        }
      }
    }
    qb.addOrderBy('ResourceRequestEmails.created_at', 'DESC');
    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    // Special case when sortBy is 'emailed'
    if (sort) {
      const [sortBy, sortOrder] = sort.split('|');
      if (sortBy === 'emailed' && sortOrder === 'desc') {
        results.reverse();
      }
    }

    return new Pagination<ResourceRequest>({
      results,
      total,
    });
  }

  async acceptResourceRequests(resourceRequestsActionInput: ResourceRequestsActionInput): Promise<boolean> {
    const { resourceRequestIds } = resourceRequestsActionInput;
    resourceRequestIds.map(async (resourceRequestId) => {
      await this.repo.save({ id: resourceRequestId, status: ResourceRequestStatus.ACCEPTED });
    });
    return true;
  }

  async removeResourceRequests(resourceRequestsActionInput: ResourceRequestsActionInput): Promise<boolean> {
    const { resourceRequestIds } = resourceRequestsActionInput;
    resourceRequestIds.map(async (resourceRequestId) => {
      await this.repo.save({ id: resourceRequestId, status: ResourceRequestStatus.REMOVED });
    });
    return true;
  }

  async deleteResourceRequests(resourceRequestsActionInput: ResourceRequestsActionInput): Promise<boolean> {
    const { resourceRequestIds } = resourceRequestsActionInput;
    resourceRequestIds.map(async (resourceRequestId) => {
      await this.repo.delete({ id: resourceRequestId });
    });
    return true;
  }

  async sendEmail(emailResourceRequestsInput: EmailResourceRequestsInput): Promise<ResourceRequestEmail[]> {
    const { resourceRequestIds, subject, body, from } = emailResourceRequestsInput;

    const resourceRequests = await this.repo
      .createQueryBuilder('resourceRequest')
      .leftJoinAndSelect('resourceRequest.Student', 'Student')
      .leftJoinAndSelect('Student.person', 'Person')
      .leftJoinAndSelect('resourceRequest.Resource', 'Resource')
      .leftJoinAndSelect('Student.parent', 'Parent')
      .leftJoinAndSelect('Parent.person', 'ParentPerson')
      .leftJoinAndSelect('resourceRequest.ResourceLevel', 'ResourceLevel')
      .whereInIds(resourceRequestIds)
      .getMany();

    const user_id = resourceRequests[0].Student.parent.person.user_id;
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }
    const resourceRequestEmailIds: number[] = [];
    for (let index = 0; index < resourceRequests.length; index++) {
      const item = resourceRequests[index];
      const content = body
        .toString()
        .replace(/\[STUDENT\]/g, item.Student.person.first_name)
        .replace(/\[PARENT\]/g, item.Student.parent.person.first_name)
        .replace(/\[USERNAME\]/g, item.Resource.std_user_name)
        .replace(/\[PASSWORD\]/g, item.Resource.std_password)
        .replace(/\[PARENT_EMAIL\]/g, item.Student.parent.person.email)
        .replace(/\[STUDENT_EMAIL\]/g, item.Student.person.email)
        .replace(/\[RESOURCE\]/g, item.Resource.title);
      const result = await this.sesEmailService.sendEmail({
        email: item.Student.parent.person.email,
        subject: subject.toString(),
        content,
        from,
        region_id,
        template_name: '',
      });
      const resourceRequestEmail = await this.resourceRequestEmailsService.create({
        resource_request_id: item.id,
        email_record_id: result.results?.emailRecordId,
        from_email: from,
        subject: subject,
        body: content,
      });
      resourceRequestEmailIds.push(resourceRequestEmail.id);
    }

    return this.resourceRequestEmailsService.findByIds(resourceRequestEmailIds);
  }

  async save(updateResourceRequestInput: UpdateResourceRequestInput): Promise<ResourceRequest> {
    try {
      const { id, resource_id, resource_level_id, username, password } = updateResourceRequestInput;
      const result = await this.repo.save({ id, resource_level_id });
      await this.resourceService.save({ resource_id, std_user_name: username, std_password: password });
      return result;
    } catch (e) {
      return e;
    }
  }
}
