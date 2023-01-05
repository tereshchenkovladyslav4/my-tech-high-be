import { Injectable, forwardRef, Inject, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, getConnection } from 'typeorm';
import { PacketsArgs } from '../dto/packets.args';
import { CreatePacketInput } from '../dto/new-packet.inputs';
import { Packet } from '../models/packet.entity';
import { PacketEmail } from '../models/packet-email.entity';
import { UpdatePacketInput } from '../dto/update-packet.inputs';
import { SaveStudentPacketInput } from '../dto/save-student-packet.inputs';
import { Pagination } from '../../paginate';
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
import { StudentPacketPDFInput } from '../dto/generate-student-packet-pdf.input';
import { StudentsService } from './students.service';
import { EmailTemplateEnum, PdfTemplate, StudentRecordFileKind, StudentStatusEnum } from '../enums';
import { FilesService } from './files.service';
import { StudentRecordService } from './student-record.service';
import { S3Service } from './s3.service';
import { UserRegion } from '../models/user-region.entity';
import { UserRegionService } from './user-region.service';
import { PDFService } from './pdf.service';
import { PacketsActionInput } from '../dto/packets-action.input';
import { StudentStatusService } from './student-status.service';

class Question {
  question: string;
  answer: string;
}
class QuestionItem {
  group_name: string;
  questions: Question[];
}
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
    private studentService: StudentsService,
    private studentStatusService: StudentStatusService,
    private filesService: FilesService,
    private studentRecordService: StudentRecordService,
    private userRegionService: UserRegionService,
    private readonly s3Service: S3Service,
    private pdfService: PDFService,
  ) {}

  async findAll(packetsArgs: PacketsArgs): Promise<Pagination<Packet>> {
    try {
      const { skip, take, sort, filters, search, region_id, selectedYearId } = packetsArgs;
      const _sortBy = sort.split('|');

      if (filters.length === 0) {
        return new Pagination<Packet>({
          results: [],
          total: 0,
        });
      }

      const userEmails = this.packetEmailsService.findByOrder();

      const qb = this.packetsRepository
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
        .andWhere(`school_year.RegionId = ${region_id}`)
        .andWhere(`school_year.school_year_id = ${selectedYearId}`);

      if (filters.includes('Age Issue')) {
        qb.orWhere('packet.is_age_issue = :isAgeIssue', { isAgeIssue: 1 });
        qb.andWhere(`school_year.RegionId = ${region_id}`);
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
            qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level');
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
            qb.addSelect("CONCAT(p_person.first_name, ' ', p_person.last_name)", 'parent_name');
            qb.orderBy('parent_name', 'DESC');
          } else {
            qb.orderBy('packet.packet_id', 'DESC');
          }
        } else {
          if (_sortBy[0] === 'student') {
            qb.orderBy('s_person.first_name', 'ASC');
          } else if (_sortBy[0] === 'grade') {
            qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level');
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
            qb.addSelect("CONCAT(p_person.first_name, ' ', p_person.last_name)", 'parent_name');
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
          result = results.slice(skip || 0, take + (skip || 0));
        }
      }

      return new Pagination<Packet>({
        results: result,
        total,
      });
    } catch (error) {
      return error;
    }
  }

  async findOneById(packet_id: number): Promise<Packet> {
    return this.packetsRepository.findOne(packet_id);
  }

  async findOneByStudentId(student_id: number): Promise<Packet> {
    return this.packetsRepository.findOne({
      where: { student_id: student_id },
    });
  }

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

  async createOrUpdate(saveStudentPacketInput: SaveStudentPacketInput): Promise<Packet> {
    return this.packetsRepository.save(saveStudentPacketInput);
  }

  async sendEmail(emailPacketInput: EmailApplicationInput): Promise<PacketEmail[]> {
    const { application_ids, subject, body } = emailPacketInput;
    const [results] = await this.packetsRepository
      .createQueryBuilder('packet')
      .leftJoinAndSelect('packet.student', 'student')
      .leftJoinAndSelect('student.applications', 'applications')
      .leftJoinAndSelect('student.person', 's_person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('student.grade_levels', 'grade')
      .whereInIds(application_ids)
      .getManyAndCount();

    const tmp = results[0];

    const studentPerson = await this.studentService.findOneById(tmp.student_id);

    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(
      studentPerson.parent?.person?.user_id,
    );

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const setAdditionalLinksInfo = (content, student, school_year, cur_application) => {
      const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();
      const yearText = cur_application.midyear_application
        ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
        : `${yearbegin}-${yearend.substring(2, 4)}`;

      return content
        .toString()
        .replace(/\[STUDENT\]/g, student.person.first_name)
        .replace(/\[PARENT\]/g, student.parent.person.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[Student\]/g, student.person.first_name)
        .replace(/\[Parent\]/g, student.parent.person.first_name)
        .replace(/\[Year\]/g, yearText);
    };

    const emailBody = [];
    results.map(async (item) => {
      const cur_application = item.student.applications[0];
      const school_year = await this.schoolYearService.findOneById(cur_application.school_year_id);
      const temp = {
        packet_id: item.packet_id,
        email: item.student.parent.person.email,
        body: setAdditionalLinksInfo(body, item.student, school_year, cur_application),
        subject: setAdditionalLinksInfo(subject, item.student, school_year, cur_application),
      };
      emailBody.push(temp);
    });
    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion(
      EmailTemplateEnum.ENROLLMENT_PACKET_PAGE,
      region_id,
    );
    if (emailTemplate) {
      await this.emailTemplateService.updateEmailTemplate(emailTemplate.id, emailTemplate.from, subject, body);
    }
    emailBody.map(async (emailData) => {
      await this.sesEmailService.sendEmail({
        email: emailData.email,
        subject: emailData.subject,
        content: emailData.body,
        from: emailTemplate.from,
        bcc: emailTemplate.bcc,
        region_id: region_id,
        template_name: 'Enrollment Packet Page',
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

  async deletePackets(packetsActionInput: PacketsActionInput): Promise<Packet[]> {
    const { packetIds } = packetsActionInput;
    const packets = await this.packetsRepository.findByIds(packetIds);
    packets.map(async (item) => {
      await this.packetsRepository.delete(item.packet_id);
      const applications = await this.applicationService.findByStudent(item.student_id);
      if (applications?.length) {
        await this.studentService.update({ student_id: item.student_id, status: StudentStatusEnum.DELETED });
        await this.studentStatusService.update({
          student_id: item.student_id,
          school_year_id: applications[0].school_year_id,
          status: StudentStatusEnum.DELETED,
        });
      }
    });
    return packets;
  }

  async moveThisYearPacket(deleteApplicationInput: DeleteApplicationInput): Promise<boolean> {
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
        ids = ids.concat(item?.student?.applications?.map((ele) => ele.application_id));
      }
    });
    if (ids.length === 0) return false;
    await this.applicationService.moveThisYearApplication({
      application_ids: ids,
    });
    return true;
  }

  async moveNextYearPacket(deleteApplicationInput: DeleteApplicationInput): Promise<boolean> {
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
        ids = ids.concat(item?.student?.applications?.map((ele) => ele.application_id));
      }
    });
    if (ids.length === 0) return false;
    await this.applicationService.moveNextYearApplication({
      application_ids: ids,
    });
    return true;
  }

  async findReminders(date: Date, reminder: number, region_id: number): Promise<Packet[]> {
    try {
      const toDate = new Date(date);
      toDate.setDate(date.getDate() + 1);
      const packets = await this.packetsRepository
        .createQueryBuilder('packet')
        .innerJoinAndSelect('packet.student', 'student')
        .innerJoinAndSelect('student.person', 'stuent_person')
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

      return packets;
    } catch (error) {
      return [];
    }
  }

  async getCountGroup(): Promise<ResponseDTO> {
    const qb = await this.packetsRepository.query('select status,COUNT(*) As count from mth_packet GROUP BY status');
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

    const age_issue_qb = await this.packetsRepository.query(`select * from mth_packet where is_age_issue = 1`);
    statusArray['Age Issue'] = age_issue_qb.length;

    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async getPacketCountByRegionId(region_id: number): Promise<ResponseDTO> {
    const qb = await this.packetsRepository.query(
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

    const age_issue_qb = await this.packetsRepository.query(
      `SELECT
          *
        FROM (
          SELECT * FROM infocenter.mth_packet
        ) AS t1
        LEFT JOIN infocenter.mth_application application ON (application.student_id = t1.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        WHERE schoolYear.RegionId=${region_id} and t1.is_age_issue = 1`,
    );
    statusArray['Age Issue'] = age_issue_qb.length;

    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async updateEnrollmentSchoolYearByIdsInput(
    updateApplicationSchoolYearInput: UpdateSchoolYearIdsInput,
  ): Promise<boolean> {
    const { application_ids, school_year_id, midyear_application } = updateApplicationSchoolYearInput;
    Promise.all(
      application_ids.map(async (id) => {
        const application_id = Number(id);
        const packet = await this.packetsRepository.findOne({ packet_id: application_id });
        const studentGradeLevel = await this.studentGradeLevelService.update(packet.student_id, school_year_id);
        const applications = await this.applicationService.findByStudent(packet.student_id);
        if (applications[0]) {
          applications[0].school_year_id = school_year_id;
          applications[0].midyear_application = midyear_application === 1 ? true : false;
          await applications[0].save();
        }
      }),
    );
    return true;
  }

  insertInfoToArray(information: QuestionItem[], group_name: string, question: string, answer: string) {
    if (information?.filter((item) => item.group_name == group_name)?.length > 0) {
      information?.map((item) => {
        if (item.group_name == group_name) {
          item.questions.push({
            question: question,
            answer: answer,
          });
        }
      });
    } else {
      information.push({
        group_name: group_name,
        questions: [
          {
            question: question,
            answer: answer,
          },
        ],
      });
    }
  }

  async generateStudentPacketPDF(param: StudentPacketPDFInput): Promise<boolean> {
    try {
      const { student_id, region_id } = param;

      const contactInfo: QuestionItem[] = [];
      const personalInfo: QuestionItem[] = [];
      const educationInfo: QuestionItem[] = [];
      const submissionInfo: QuestionItem[] = [];

      const studentInfo = await this.studentService.findOneById(student_id);
      if (!studentInfo)
        throw new ServiceUnavailableException(`Not found Student Informations for student: ${student_id}`);

      const packets = await this.findByStudent(studentInfo?.student_id);
      if (!packets || packets.length == 0)
        throw new ServiceUnavailableException(`Not found Student Packet Informations.for student: ${student_id}`);
      const packet = packets?.[packets?.length - 1];

      const schoolYear = await this.schoolYearService.findOneById(studentInfo?.student_grade_level?.school_year_id);
      if (!schoolYear) throw new ServiceUnavailableException(`Not found SchoolYear Info for student: ${student_id}.`);

      const yearbegin = Moment(schoolYear.date_begin).format('YYYY');
      const yearend = Moment(schoolYear.date_end).format('YYYY');

      const packetPdfInfo = {
        student: {
          ...studentInfo?.person,
          date_of_birth: Moment(studentInfo?.person?.date_of_birth).format('MMMM D, YYYY'),
          phone_number: studentInfo?.person?.person_phone?.number,
          grade_levels: studentInfo?.grade_levels,
          grade_level: `${studentInfo?.student_grade_level?.grade_level} (${yearbegin}-${yearend})`,
          address: studentInfo?.person?.person_address?.address,
        },
        parent: {
          ...studentInfo?.parent?.person,
          date_of_birth: Moment(studentInfo?.parent?.person?.date_of_birth).format('MMMM D, YYYY'),
          phone_number: studentInfo?.parent?.person?.person_phone?.number,
          address: studentInfo?.parent?.person?.person_address?.address,
        },
        packet: { ...packet },
        meta: packet?.meta ? { ...JSON.parse(packet?.meta) } : {},
        address: { ...studentInfo?.person?.person_address?.address },
        school_year_id: studentInfo?.student_grade_level?.school_year_id,
      };

      const queryRunner = await getConnection().createQueryRunner();
      const enrollmentQuestions = await queryRunner.query(`
        SELECT
          questionTab.tab_name,
          questionGroup.group_name,
          questions.*
        FROM (
          SELECT * FROM infocenter.mth_enrollment_questions
        ) as questions
        LEFT JOIN infocenter.mth_enrollment_question_group questionGroup ON (questionGroup.id = questions.group_id)
        LEFT JOIN infocenter.mth_enrollment_question_tab questionTab ON (questionTab.id = questionGroup.tab_id)
        WHERE questionTab.region_id = ${region_id}
        ORDER BY questionTab.id, questionGroup.order, questions.order;
      `);
      queryRunner.release();

      if (!enrollmentQuestions || enrollmentQuestions.length == 0)
        throw new ServiceUnavailableException(`Not found Enrollment Questions for student: ${student_id}`);

      enrollmentQuestions?.map((question) => {
        if (!question?.group_name.includes('Instructions')) {
          const keyName = question.slug?.split('_')[0];
          const fieldName = !question.slug?.includes('meta_')
            ? question.slug?.replace(`${keyName}_`, '')
            : question.slug;
          const options = JSON.parse(question.options || '');
          const answer =
            options?.length && question?.type != 4 && question?.type != 3
              ? options?.filter(
                  (option) =>
                    (typeof option.value == 'string' && option.value == `${packetPdfInfo[keyName][fieldName]}`) ||
                    (typeof option.value != 'string' && option.value == Number(packetPdfInfo[keyName][fieldName])),
                )?.[0]?.label || packetPdfInfo[keyName][fieldName]
              : question?.type == 4 && packetPdfInfo[keyName][fieldName]
              ? 'Checked'
              : question?.type == 3 && packetPdfInfo[keyName][fieldName]
              ? packetPdfInfo[keyName][fieldName]?.map((item) => item?.label)?.join(', ')
              : packetPdfInfo[keyName][fieldName];

          if (answer) {
            if (question?.tab_name == 'Contact') {
              this.insertInfoToArray(contactInfo, question?.group_name, question?.question, answer);
            } else if (question?.tab_name == 'Personal') {
              this.insertInfoToArray(personalInfo, question?.group_name, question?.question, answer);
            } else if (question?.tab_name == 'Education') {
              this.insertInfoToArray(educationInfo, question?.group_name, question?.question, answer);
            } else if (question?.tab_name == 'Submission') {
              this.insertInfoToArray(submissionInfo, question?.group_name, question?.question, answer);
            }
          }
        }
      });

      const signatureFileInfo = await this.filesService.findOneById(packet?.signature_file_id);
      if (!signatureFileInfo)
        throw new ServiceUnavailableException(`Not found Signature File for student: ${student_id}.`);

      const options = {
        format: 'A4',
        orientation: 'portrait',
        border: '10mm',
      };
      const pdfBuffer = await this.pdfService.create(
        PdfTemplate.STUDENT_PACKET,
        {
          contactInfo: contactInfo,
          personalInfo: personalInfo,
          educationInfo: educationInfo,
          submissionInfo: submissionInfo,
          signature_date: Moment(packet?.date_submitted).format('MM/DD/YYYY'),
          signature_name: `${studentInfo?.parent?.person?.first_name} ${studentInfo?.parent?.person?.last_name}`,
          signature_url: signatureFileInfo?.signedUrl,
        },
        options,
      );

      const uploadFile = await this.filesService.upload(
        pdfBuffer,
        `${schoolYear?.region?.name}/Student Records/${student_id}`,
        StudentRecordFileKind.STUDENT_PACKET,
        'application/pdf',
        yearbegin,
      );

      await this.studentRecordService.createStudentRecord(
        student_id,
        region_id,
        uploadFile.file_id,
        StudentRecordFileKind.STUDENT_PACKET,
      );
      return true;
    } catch (err) {
      throw new ServiceUnavailableException(err, `${param}`);
    }
  }
}
