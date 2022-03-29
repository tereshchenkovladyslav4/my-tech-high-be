import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';
import { PacketsArgs, DeletePacketArgs } from '../dto/packets.args';
import { CreatePacketInput } from '../dto/new-packet.inputs';
import { Packet } from '../models/packet.entity';
import { UpdatePacketInput } from '../dto/update-packet.inputs';
import { SaveStudentPacketInput } from '../dto/save-student-packet.inputs';
import { Pagination, PaginationOptionsInterface } from '../../paginate';
import { ResponseDTO } from '../dto/response.dto';
import { EmailsService } from './emails.service';
import { DeleteApplicationInput } from '../dto/delete-application.inputs';
import { ApplicationsService } from './applications.service';
import { EmailApplicationInput } from '../dto/email-application.inputs';
import { EmailTemplatesService } from './email-templates.service';
@Injectable()
export class PacketsService {
  constructor(
    @InjectRepository(Packet)
    private readonly packetsRepository: Repository<Packet>,
    private sesEmailService: EmailsService,
    @Inject(forwardRef(() => ApplicationsService))
    private applicationService: ApplicationsService,
    private emailTemplateService: EmailTemplatesService,
  ) {}

  async findAll(packetsArgs: PacketsArgs): Promise<Pagination<Packet>> {
    const { skip, take, sort, filters, search } = packetsArgs;
    const _sortBy = sort.split('|');
    let order = {};
    order[_sortBy && _sortBy[0]] = (_sortBy && _sortBy[1]) || 'ASC';

    if (filters.length === 0) {
      return new Pagination<Packet>({
        results: [],
        total: 0,
      });
    }

    let qb = this.packetsRepository
      .createQueryBuilder('packet')
      .leftJoinAndSelect('packet.student', 'student')
      .leftJoinAndSelect('student.person', 's_person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .where('packet.status IN (:status)', { status: filters });

    if (filters.includes('Age Issue')) {
      qb = qb.orWhere('packet.is_age_issue = :isAgeIssue', { isAgeIssue: 1 });
    }

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere('packet.status like :text', { text: `%${search}%` })
            .orWhere('packet.packet_id like :text', { text: `%${search}%` })
            .orWhere('s_person.first_name like :text', { text: `%${search}%` })
            .orWhere('s_person.last_name like :text', { text: `%${search}%` })
            .orWhere('p_person.first_name like :text', { text: `%${search}%` })
            .orWhere('p_person.last_name like :text', { text: `%${search}%` });
        }),
      );
    }
    const [results, total] = await qb
      .skip(skip)
      .take(take)
      .orderBy('packet.packet_id', 'DESC')
      .getManyAndCount();
    return new Pagination<Packet>({
      results,
      total,
    });
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
  async sendEmail(emailPacketInput: EmailApplicationInput): Promise<Packet[]> {
    const { application_ids, subject, body } = emailPacketInput;
    const [results, total] = await this.packetsRepository
      .createQueryBuilder('packet')
      .leftJoinAndSelect('packet.student', 'student')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'person')
      .whereInIds(application_ids)
      .getManyAndCount();
    const emails = results.map((item) => item.student.parent.person.email);
    const emailTemplate = await this.emailTemplateService.findByTemplate(
      'Enrollment Packet Page',
    );
    if (emailTemplate) {
      await this.emailTemplateService.updateEmailTemplate(
        emailTemplate.id,
        subject,
        body,
      );
    }
    emails.forEach(async (email) => {
      const result = await this.sesEmailService.sendEmail({
        email,
        subject,
        content: body,
        from: emailTemplate.from,
        bcc: emailTemplate.bcc,
      });
    });
    return results;
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

  async findReminders(date: Date): Promise<string[]> {
    try {
      const toDate = new Date(date);
      toDate.setDate(date.getDate() + 1);
      const packets = await this.packetsRepository
        .createQueryBuilder('packet')
        .innerJoinAndSelect('packet.student', 'student')
        .innerJoinAndSelect('student.parent', 'parent')
        .innerJoinAndSelect('parent.person', 'person')
        .where('packet.status IN (:status)', {
          status: ['Started', 'Not Started'],
        })
        .andWhere('packet.deadline >= :startDate', { startDate: date })
        .andWhere('packet.deadline < :toDate', { toDate: toDate })
        .getMany();
      console.log(date, toDate, 'reminders data ---------------');

      return packets.map((item) => item.student.parent.person.email);
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
