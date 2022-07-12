import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';
import { PacketsArgs, DeletePacketArgs } from '../dto/packets.args';
import { CreatePacketInput } from '../dto/new-packet.inputs';
import { Packet } from '../models/packet.entity';
import { PacketEmail } from '../models/packet-email.entity';
import { UpdatePacketInput } from '../dto/update-packet.inputs';
import { SaveStudentPacketInput } from '../dto/save-student-packet.inputs';
import { Pagination, PaginationOptionsInterface } from '../../paginate';
import { ResponseDTO } from '../dto/response.dto';
import { EmailsService } from './emails.service';
import { PacketEmailsService } from './packet-emails.service';
import { DeleteApplicationInput } from '../dto/delete-application.inputs';
import { ApplicationsService } from './applications.service';
import { EmailApplicationInput } from '../dto/email-application.inputs';
import { EmailTemplatesService } from './email-templates.service';
import * as Moment from 'moment';
import { SchoolYearService } from './schoolyear.service';
import { UpdateSchoolYearIdsInput } from '../dto/school-update-application.inputs';
import { StudentGradeLevelsService } from './student-grade-levels.service';

@Injectable()
export class PacketsService {
  constructor(
    @InjectRepository(Packet)
    private readonly packetsRepository: Repository<Packet>,
    private sesEmailService: EmailsService,
    private schoolYearService: SchoolYearService,
    private packetEmailsService: PacketEmailsService,
    @Inject(forwardRef(() => ApplicationsService))
    private applicationService: ApplicationsService,
    private emailTemplateService: EmailTemplatesService,
    private studentGradeLevelService: StudentGradeLevelsService,
  ) { }

  async findAll(packetsArgs: PacketsArgs): Promise<Pagination<Packet>> {
    const { skip, take, sort, filters, search, region_id } = packetsArgs;
    const _sortBy = sort.split('|');

    if (filters.length === 0) {
      return new Pagination<Packet>({
        results: [],
        total: 0,
      });
    }

    const userEmails = this.packetEmailsService.findByOrder();

    let qb = this.packetsRepository
      .createQueryBuilder('packet')
      .leftJoinAndSelect('packet.student', 'student')
      .leftJoinAndSelect('student.applications', 'applications')
      .leftJoinAndSelect('applications.school_year', 'school_year')
      .leftJoinAndSelect('student.person', 's_person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('student.status', 'status')
      .leftJoinAndSelect('student.reenrollment_status', 'r_status')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('student.grade_levels', 'grade_levels')
      .leftJoinAndSelect('packet.packet_emails', 'packet_emails')
      .leftJoinAndSelect('packet.packet_emails', '(' + userEmails + ')')

      .where('packet.status IN (:status)', { status: filters })
      .andWhere(`school_year.RegionId = ${region_id}`);

    if (filters.includes('Age Issue')) {
      qb = qb.orWhere('packet.is_age_issue = :isAgeIssue', { isAgeIssue: 1 });
    }
    if (search) {
      const date = search
        .split('/')
        .filter((v) => v)
        .join('-');
      qb.andWhere(
        new Brackets((sub) => {
          if (
            search.indexOf('st') > -1 ||
            search.indexOf('th') > -1 ||
            search.indexOf('rd') > -1 ||
            search.indexOf('nd') > -1
          ) {
            sub.where('grade_levels.grade_level like :text', {
              text: `%${search.match(/\d+/)[0]}%`,
            });
          } else {
            sub
              .orWhere('packet.status like :text', { text: `%${search}%` })
              .orWhere('packet.packet_id like :text', { text: `%${search}%` })
              .orWhere('s_person.first_name like :text', {
                text: `%${search}%`,
              })
              .orWhere('s_person.last_name like :text', { text: `%${search}%` })
              .orWhere('p_person.first_name like :text', {
                text: `%${search}%`,
              })
              .orWhere('p_person.last_name like :text', { text: `%${search}%` })
              .orWhere('packet.deadline like :text', { text: `%${date}%` });
            if (Moment(search, 'MM/DD/YY', true).isValid()) {
              sub.orWhere('packet.deadline like :text', {
                text: `%${Moment(search).format('YYYY-MM-DD')}%`,
              });
            }
          }
        }),
      );
    }

    if (sort) {
      if (_sortBy[1].toLocaleLowerCase() === 'desc') {
        if (_sortBy[0] === 'student') {
          qb.orderBy('s_person.first_name', 'DESC');
        } else if (_sortBy[0] === 'grade') {
          qb.addSelect(
            'ABS(grade_levels.grade_level + 0)',
            'student_grade_level',
          );
          qb.orderBy('student_grade_level', 'DESC');
        } else if (_sortBy[0] === 'submitted' || _sortBy[0] === 'deadline') {
          qb.orderBy('packet.deadline', 'DESC');
        } else if (_sortBy[0] === 'status') {
          qb.orderBy('packet.status', 'DESC');
        } else if (_sortBy[0] === 'studentStatus') {
          qb.orderBy('status.status', 'DESC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`(${userEmails}).created_at`, 'DESC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect(
            "CONCAT(p_person.first_name, ' ', p_person.last_name)",
            'parent_name',
          );
          qb.orderBy('parent_name', 'DESC');
        } else {
          qb.orderBy('packet.packet_id', 'DESC');
        }
      } else {
        if (_sortBy[0] === 'student') {
          qb.orderBy('s_person.first_name', 'ASC');
        } else if (_sortBy[0] === 'grade') {
          qb.addSelect(
            'ABS(grade_levels.grade_level + 0)',
            'student_grade_level',
          );
          qb.orderBy('student_grade_level', 'ASC');
        } else if (_sortBy[0] === 'submitted' || _sortBy[0] === 'deadline') {
          qb.orderBy('packet.deadline', 'ASC');
        } else if (_sortBy[0] === 'studentStatus') {
          qb.orderBy('status.status', 'ASC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`(${userEmails}).created_at`, 'ASC');
        } else if (_sortBy[0] === 'status') {
          qb.orderBy('packet.status', 'ASC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect(
            "CONCAT(p_person.first_name, ' ', p_person.last_name)",
            'parent_name',
          );
          qb.orderBy('parent_name', 'ASC');
        } else {
          qb.orderBy('packet.packet_id', 'ASC');
        }
      }
    }

    let result = [];
    const [results, total] = await qb.getManyAndCount();
    if (take) {
      if (total < (skip || 0) + take) {
        result = results.slice(skip || 0, results.length);
      } else {
        result = results.slice(skip || 0, take);
      }
    }
    return new Pagination<Packet>({
      results: result,
      total,
    });

    // const [results, total] = await qb.skip(skip).take(take).getManyAndCount();
    // return new Pagination<Packet>({
    //   results,
    //   total,
    // });
  }

  async findOneById(packet_id: number): Promise<Packet> {
    return this.packetsRepository.findOne(packet_id);
  }

  async findOneByStudentId(student_id: number): Promise<Packet> {
    return this.packetsRepository.findOne({
      where: { student_id: student_id },
    });
  }

  // async deletePacket(data: DeletePacketArgs, user: any): Promise<ResponseDTO> {
  //   const { packetIds } = data;
  //   await this.packetsRepository.delete({
  //     packet_id: In(packetIds.split(',').map(Number)),
  //   });

  //   return <ResponseDTO>{
  //     error: false,
  //     message: 'Deleted Successfully',
  //   };
  // }

  async findByStudent(student_id: number): Promise<Packet[]> {
    return this.packetsRepository.find({
      where: {
        student_id: student_id,
      },
    });
  }

  async create(packet: CreatePacketInput): Promise<Packet> {
    return this.packetsRepository.save(packet);
  }

  async update(updatePacketInput: UpdatePacketInput): Promise<Packet> {
    return this.packetsRepository.save(updatePacketInput);
  }

  async createOrUpdate(
    saveStudentPacketInput: SaveStudentPacketInput,
  ): Promise<Packet> {
    return this.packetsRepository.save(saveStudentPacketInput);
  }

  async getPacketStatues(): Promise<ResponseDTO> {
    const statusArray = [
      'Not Started',
      'Missing Info',
      'Submitted',
      'Resubmitted',
      'Age Issue',
      'Conditional',
      'Accepted',
    ];
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }
  async sendEmail(
    emailPacketInput: EmailApplicationInput,
  ): Promise<PacketEmail[]> {
    const { application_ids, subject, body } = emailPacketInput;
    const [results] = await this.packetsRepository
      .createQueryBuilder('packet')
      .leftJoinAndSelect('packet.student', 'student')
      .leftJoinAndSelect('student.person', 's_person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('student.grade_levels', 'grade')
      .whereInIds(application_ids)
      .getManyAndCount();

    const setEmailBodyInfo = (student, school_year) => {
      const yearbegin = new Date(school_year.date_begin)
        .getFullYear()
        .toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();

      return body
        .toString()
        .replace(/\[STUDENT\]/g, student.person.first_name)
        .replace(/\[PARENT\]/g, student.parent.person.first_name)
        .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
        .replace(/\[Student\]/g, student.person.first_name)
        .replace(/\[Parent\]/g, student.parent.person.first_name)
        .replace(/\[Year\]/g, `${yearbegin}-${yearend.substring(2, 4)}`);
    };

    const emailBody = [];
    results.map(async (item) => {
      const school_year = await this.schoolYearService.findOneById(
        results[0].student.grade_levels[0].school_year_id,
      );
      const temp = {
        packet_id: item.packet_id,
        email: item.student.parent.person.email,
        body: setEmailBodyInfo(item.student, school_year),
      };
      emailBody.push(temp);
    });
    const emailTemplate = await this.emailTemplateService.findByTemplate(
      'Enrollment Packet Page',
    );
    if (emailTemplate) {
      await this.emailTemplateService.updateEmailTemplate(
        emailTemplate.id,
        emailTemplate.from,
        subject,
        body,
      );
    }
    emailBody.map(async (emailData) => {
      const result = await this.sesEmailService.sendEmail({
        email: emailData.email,
        subject,
        content: emailData.body,
        from: emailTemplate.from,
        bcc: emailTemplate.bcc,
      });
    });
    const packetEmails = Promise.all(
      emailBody.map(async (item) => {
        return await this.packetEmailsService.create({
          packet_id: item?.packet_id,
          subject: subject,
          body: item?.body,
          from_email: emailTemplate.from,
        });
      }),
    );
    return packetEmails;
  }

  async deletePacket(
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Packet[]> {
    const { application_ids } = deleteApplicationInput;
    const applications = await this.packetsRepository.findByIds(
      application_ids,
    );
    const result = await this.packetsRepository.delete(application_ids);
    return applications;
  }

  async moveThisYearPacket(
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
    const { application_ids } = deleteApplicationInput;
    const packets = await this.packetsRepository
      .createQueryBuilder('packet')
      .leftJoinAndSelect('packet.student', 'student')
      .leftJoinAndSelect('student.applications', 'applications')
      .where('packet.packet_id IN (:ids)', { ids: application_ids })
      .getMany();
    let ids = [];
    packets.map((item) => {
      if (item?.student?.applications) {
        ids = ids.concat(
          item?.student?.applications?.map((ele) => ele.application_id),
        );
      }
    });
    if (ids.length === 0) return false;
    const result = await this.applicationService.moveThisYearApplication({
      application_ids: ids,
    });
    return true;
  }

  async moveNextYearPacket(
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
    const { application_ids } = deleteApplicationInput;
    const packets = await this.packetsRepository
      .createQueryBuilder('packet')
      .leftJoinAndSelect('packet.student', 'student')
      .leftJoinAndSelect('student.applications', 'applications')
      .where('packet.packet_id IN (:ids)', { ids: application_ids })
      .getMany();
    let ids = [];
    packets.map((item) => {
      if (item?.student?.applications) {
        ids = ids.concat(
          item?.student?.applications?.map((ele) => ele.application_id),
        );
      }
    });
    if (ids.length === 0) return false;
    const result = await this.applicationService.moveNextYearApplication({
      application_ids: ids,
    });
    return true;
  }

  async findReminders(
    date: Date,
    reminder: Number,
    region_id: Number,
  ): Promise<string[]> {
    try {
      const toDate = new Date(date);
      toDate.setDate(date.getDate() + 1);
      const packets = await this.packetsRepository
        .createQueryBuilder('packet')
        .innerJoinAndSelect('packet.student', 'student')
        .leftJoinAndSelect('student.applications', 'applications')
        .leftJoinAndSelect('applications.school_year', 'school_year')
        .leftJoinAndSelect('school_year.region', 'region')
        .innerJoinAndSelect('student.parent', 'parent')
        .innerJoinAndSelect('parent.person', 'person')
        .where('packet.status IN (:status)', {
          status: ['Started', 'Not Started'],
        })
        .andWhere(`school_year.RegionId = ${region_id}`)
        .andWhere(
          `DATE( DATE_ADD(applications.date_accepted, INTERVAL GREATEST( ( region.enrollment_packet_deadline_num_days - :reminderDate ), 0 ) DAY) ) = CURDATE()`,
          { reminderDate: reminder },
        )
        //.andWhere('packet.deadline >= :startDate', { startDate: date })
        //.andWhere('packet.deadline < :toDate', { toDate: toDate })
        .getMany();
      console.log(date, toDate, 'reminders data ---------------');

      return packets.map((item) => item.student.parent.person.email);
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getCountGroup(): Promise<ResponseDTO> {
    let qb = await this.packetsRepository.query(
      'select status,COUNT(*) As count from mth_packet GROUP BY status',
    );
    const statusArray = {
      'Not Started': 0,
      'Missing Info': 0,
      Submitted: 0,
      Resubmitted: 0,
      'Age Issue': 0,
      Conditional: 0,
      Accepted: 0,
    };
    qb.map((item) => {
      statusArray[item.status] = +item.count;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async getpacketCountByRegionId(region_id: number): Promise<ResponseDTO> {
    let qb = await this.packetsRepository.query(
      `SELECT
          t1.status AS status,
          COUNT(*) AS count
        FROM (
          SELECT * FROM infocenter.mth_packet
        ) AS t1
        LEFT JOIN infocenter.mth_application application ON (application.student_id = t1.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        WHERE schoolYear.RegionId=${region_id}
        GROUP BY t1.status`,
    );
    const statusArray = {
      'Not Started': 0,
      'Missing Info': 0,
      Submitted: 0,
      Resubmitted: 0,
      'Age Issue': 0,
      Conditional: 0,
      Accepted: 0,
    };
    qb.map((item) => {
      statusArray[item.status] = +item.count;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async updateEnrollmentSchoolYearByIdsInput(
    updateApplicationSchoolYearInput: UpdateSchoolYearIdsInput,
  ): Promise<Boolean> {
    const { application_ids, school_year_id, midyear_application } = updateApplicationSchoolYearInput;
    Promise.all(
      application_ids.map(async (id) => {
        const application_id = Number(id);
        const packet = await this.packetsRepository.findOne({ packet_id: application_id });
        const studentGradeLevel = await this.studentGradeLevelService.update(packet.student_id, school_year_id);
      })
    );
    return true;
  }
}
