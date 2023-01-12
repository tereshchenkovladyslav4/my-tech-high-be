import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ParentsService } from './services/parents.service';
import { PersonsService } from './services/persons.service';
import { PhonesService } from './services/phones.service';
import { StudentsService } from './services/students.service';
import { StudentGradeLevelsService } from './services/student-grade-levels.service';
import { PacketsService } from './services/packets.service';
import { EnrollmentPacketContactInput } from './dto/enrollment-packet-contact.inputs';
import { EnrollmentPacketPersonalInput } from './dto/enrollment-packet-personal.inputs';
import { EnrollmentPacket } from './models/enrollment-packet.entity';
import { EnrollmentPacketEducationInput } from './dto/enrollment-packet-education.inputs';
import { PersonAddressService } from './services/person-address.service';
import { EnrollmentPacketInput } from './dto/enrollment-packet.inputs';
import { EnrollmentPacketDocumentInput } from './dto/enrollment-packet-document.inputs';
import { SchoolYearService } from './services/schoolyear.service';
import * as Moment from 'moment';
import { PacketFilesService } from './services/packet-files.service';
import { EnrollmentPacketSubmissionInput } from './dto/enrollment-packet-submission.inputs';
import { EmailTemplatesService } from './services/email-templates.service';
import { EmailsService } from './services/emails.service';
import { EmailReminderService } from './services/email-reminder.service';
import { UserRegion } from './models/user-region.entity';
import { UserRegionService } from './services/user-region.service';
import { EnrollmentPacketSubmitInput } from './dto/enrollment-packet-submit.input';
import { DeleteEnrollmentPacketDocumentsInput } from './dto/delete-enrollment-packet-documents.input';

const common_1 = require('@nestjs/common');
const templates = {
  Accepted: 'Packet Accepted',
  //   'Missing Info': 'Missing Information',
  //   Reminders: 'Packet Reminders',
};

@Injectable()
export class EnrollmentsService {
  constructor(
    private parentsService: ParentsService,
    private personsService: PersonsService,
    private phonesService: PhonesService,
    private studentsService: StudentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private packetsService: PacketsService,
    private personAddressService: PersonAddressService,
    private schoolYearService: SchoolYearService,
    private packetFilesService: PacketFilesService,
    private emailTemplateService: EmailTemplatesService,
    private sesEmailService: EmailsService,
    private emailReminderService: EmailReminderService,
    private userRegionService: UserRegionService,
  ) {}

  async saveEnrollmentPacket(enrollmentPacketInput: EnrollmentPacketInput): Promise<EnrollmentPacket> {
    const {
      packet_id,
      admin_notes,
      student_person_id,
      parent_person_id,
      medical_exemption,
      exemption_form_date,
      packet,
      student,
      parent,
      meta,
      status,
      school_year_id,
      missing_files,
      student_id,
      fromAdmin,
    } = enrollmentPacketInput;

    try {
      let is_age_issue = false;
      if (student_person_id) {
        const studentPerson = await this.personsService.update({
          person_id: student_person_id,
          ...student,
        });

        if (student.address) {
          await this.personAddressService.createOrUpdate(studentPerson, student.address);
        }

        const { grade_level } = student;
        if (school_year_id && grade_level && student_id) {
          await this.studentGradeLevelsService.createOrUpdate({
            student_id,
            school_year_id,
            grade_level,
          });
        }

        const parseGradeLevel = (value: number | string): number => {
          if (!value) return 0;
          if (value === 'OR-K') return 0;
          if (['K', 'Kindergarten', 'Kin'].indexOf(value + '') !== -1) return 5;
          return Number(value) + 5;
        };

        const school_year = await this.schoolYearService.findOneById(school_year_id);

        if (school_year.birth_date_cut) {
          if (Moment(studentPerson.date_of_birth).isAfter(school_year.birth_date_cut)) is_age_issue = true;

          const age = studentPerson.date_of_birth
            ? Moment(school_year.birth_date_cut).diff(studentPerson.date_of_birth, 'years', false)
            : 0;
          const grade_age = parseGradeLevel(grade_level);

          if (studentPerson.date_of_birth && grade_age != 0) {
            if (age != grade_age) is_age_issue = true;
          }
        }
      }

      if (parent_person_id) {
        await this.personsService.update({
          person_id: parent_person_id,
          ...parent,
        });

        const parentPhone = await this.phonesService.findOneByPersonId(parent_person_id);
        if (!parentPhone) {
          await this.phonesService.create({
            person_id: parent_person_id,
            number: parent.phone_number,
          });
        } else {
          await this.phonesService.create({
            phone_id: parentPhone.phone_id,
            person_id: parent_person_id,
            number: parent.phone_number,
          });
        }
      }

      let studentPacket = null;
      if (status != 'Submitted' && status != 'Resubmitted') is_age_issue = false;

      if (status == 'Accepted') {
        studentPacket = await this.packetsService.update({
          packet_id: packet_id,
          ...packet,
          admin_notes: admin_notes,
          date_accepted: new Date(),
          medical_exemption,
          exemption_form_date: exemption_form_date ? new Date(exemption_form_date) : null,
          status: status,
          is_age_issue,
          missing_files,
          meta,
        });
      } else {
        studentPacket = await this.packetsService.update({
          packet_id: packet_id,
          ...packet,
          admin_notes: admin_notes,
          medical_exemption,
          exemption_form_date: exemption_form_date ? new Date(exemption_form_date) : null,
          status: status,
          is_age_issue,
          missing_files,
          meta,
        });
      }

      if (templates[status] && !fromAdmin) {
        const tmp = await this.packetsService.findOneById(packet_id);

        const studentPerson = await this.studentsService.findOneById(tmp.student_id);

        const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(
          studentPerson.parent?.person?.user_id,
        );

        let region_id = 1;
        if (regions.length != 0) {
          region_id = regions[0].region_id;
        }

        const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion(templates[status], region_id);
        const application = studentPerson.applications[0];

        if (emailTemplate) {
          const setEmailBodyInfo = (student, school_year) => {
            const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
            const yearend = new Date(school_year.date_end).getFullYear().toString();

            const yearText = application.midyear_application
              ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
              : `${yearbegin}-${yearend.substring(2, 4)}`;

            return emailTemplate.body
              .toString()
              .replace(/\[STUDENT\]/g, student.person.first_name)
              .replace(/\[PARENT\]/g, student.parent.person.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[APPLICATION_YEAR\]/g, yearText)
              .replace(/\[DEADLINE\]/g, `${Moment().format('MM/DD/yy')}`);
          };

          const setEmailSubjectInfo = (student, school_year) => {
            const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
            const yearend = new Date(school_year.date_end).getFullYear().toString();

            const yearText = application.midyear_application
              ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
              : `${yearbegin}-${yearend.substring(2, 4)}`;

            return emailTemplate.subject
              .toString()
              .replace(/\[STUDENT\]/g, student.person.first_name)
              .replace(/\[PARENT\]/g, student.parent.person.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[APPLICATION_YEAR\]/g, yearText)
              .replace(/\[DEADLINE\]/g, `${Moment().format('MM/DD/yy')}`);
          };
          // const gradeLevels = await this.studentGradeLevelsService.forStudents(tmp.student_id);
          const school_year = await this.schoolYearService.findOneById(application.school_year_id);
          const body = setEmailBodyInfo(studentPerson, school_year);
          const emailSubject = setEmailSubjectInfo(studentPerson, school_year);

          await this.sesEmailService.sendEmail({
            email: studentPerson.parent?.person?.email,
            subject: emailSubject,
            content: body,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
            region_id: region_id,
            template_name: templates[status],
          });
        }
      }

      return {
        packet: studentPacket,
      };
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
    }
  }

  async saveContacts(enrollmentPacketContactInput: EnrollmentPacketContactInput): Promise<EnrollmentPacket> {
    const { student_id, packet, school_year_id } = enrollmentPacketContactInput;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');

    const packetData = await this.packetsService.findOneByStudentId(student_id);
    const packet_id = (packetData && (await packetData).packet_id) || null;

    const parentId = (await student).parent_id;
    const parent = this.parentsService.findOneById(parentId);
    if (!parent) throw new ServiceUnavailableException('Parent Not Found');

    const studentPersonId = (await student).person_id;
    const parentPersonId = (await parent).person_id;

    try {
      let special_ed = 0;
      const student_meta = JSON.parse(packet.meta);
      if ('meta_special_education' in student_meta) {
        special_ed = Number(student_meta['meta_special_education']);
      }
      await this.studentsService.update({
        student_id,
        special_ed,
      });

      const parentPerson = await this.personsService.update({
        person_id: parentPersonId,
        ...enrollmentPacketContactInput.parent,
      });

      const parentPhone = await this.phonesService.findOneByPersonId(parentPersonId);
      if (!parentPhone) {
        await this.phonesService.create({
          person_id: parentPersonId,
          number: enrollmentPacketContactInput.parent.phone_number,
        });
      } else {
        await this.phonesService.create({
          phone_id: parentPhone.phone_id,
          person_id: parentPersonId,
          number: enrollmentPacketContactInput.parent.phone_number,
        });
      }

      if (!parentPhone) throw new ServiceUnavailableException('Parent Phone Not Created');

      const studentPerson = await this.personsService.update({
        person_id: studentPersonId,
        ...enrollmentPacketContactInput.student,
      });

      await this.personAddressService.createOrUpdate(parentPerson, enrollmentPacketContactInput.student.address);
      // const street2 = enrollmentPacketContactInput.student.address.street2 || "";
      // const address = await this.addressService.create({...enrollmentPacketContactInput.student.address, street2});
      // console.log("Address: ", address);

      // const address_id = (await address).address_id;
      // const personAddress = await this.personAddressService.create({
      //     person_id: studentPerson.person_id,
      //     address_id
      // });

      const phone = await this.phonesService.create({
        person_id: studentPerson.person_id,
        number: enrollmentPacketContactInput.student.phone_number,
      });
      if (!phone) throw new ServiceUnavailableException('Student Phone Not Created');

      const { grade_level } = enrollmentPacketContactInput.student;
      if (school_year_id && grade_level) {
        await this.studentGradeLevelsService.createOrUpdate({
          student_id,
          school_year_id,
          grade_level,
        });
      }

      const studentPacket = await this.packetsService.createOrUpdate({
        packet_id,
        student_id,
        status: 'Started',
        deadline: packetData ? packetData.deadline.toISOString() : new Date().toISOString(),
        date_accepted: null,
        date_submitted: new Date(),
        date_last_submitted: new Date(),
        secondary_contact_first: packet.secondary_contact_first,
        secondary_contact_last: packet.secondary_contact_last,
        school_district: packet.school_district,
        meta: packet.meta,
        special_ed: String(special_ed),
      });
      await this.studentsService.findOneById(student_id);

      return {
        student,
        packet: studentPacket,
      };
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
    }
  }

  async submitEnrollment(enrollmentPacketContactInput: EnrollmentPacketSubmitInput): Promise<EnrollmentPacket> {
    const { student_id, packet, school_year_id, signature_file_id } = enrollmentPacketContactInput;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');

    const packetData = await this.packetsService.findOneByStudentId(student_id);
    const g_packet_id = (packetData && (await packetData).packet_id) || null;

    const parentId = (await student).parent_id;
    const parent = this.parentsService.findOneById(parentId);
    if (!parent) throw new ServiceUnavailableException('Parent Not Found');

    const studentPersonId = (await student).person_id;
    const parentPersonId = (await parent).person_id;

    try {
      const parentPerson = await this.personsService.update({
        person_id: parentPersonId,
        ...enrollmentPacketContactInput.parent,
      });

      const studentPerson = await this.personsService.update({
        person_id: studentPersonId,
        ...enrollmentPacketContactInput.student,
      });

      await this.personAddressService.createOrUpdate(parentPerson, enrollmentPacketContactInput.student.address);
      // const street2 = enrollmentPacketContactInput.student.address.street2 || "";
      // const address = await this.addressService.create({...enrollmentPacketContactInput.student.address, street2});
      // console.log("Address: ", address);

      // const address_id = (await address).address_id;
      // const personAddress = await this.personAddressService.create({
      //     person_id: studentPerson.person_id,
      //     address_id
      // });

      const phone = await this.phonesService.create({
        person_id: studentPerson.person_id,
        number: enrollmentPacketContactInput.student.phone_number,
      });
      if (!phone) throw new ServiceUnavailableException('Student Phone Not Created');

      const { grade_level } = enrollmentPacketContactInput.student;
      if (school_year_id) {
        await this.studentGradeLevelsService.createOrUpdate({
          student_id,
          school_year_id,
          grade_level,
        });
      }

      let status = 'Submitted';
      if (
        packetData &&
        packetData.missing_files
        //  && JSON.stringify(packetData.missing_files) && JSON.parse(packetData.missing_files).length > 0
      ) {
        status = 'Resubmitted';
      }

      const parseGradeLevel = (value: number | string): number => {
        if (!value) return 0;
        if (value === 'OR-K') return 0;
        if (['K', 'Kindergarten', 'Kin'].indexOf(value + '') !== -1) return 5;
        return Number(value) + 5;
      };

      const school_year = await this.schoolYearService.findOneById(school_year_id);
      let is_age_issue = false;

      if (school_year.birth_date_cut) {
        if (Moment(studentPerson.date_of_birth).isAfter(school_year.birth_date_cut)) is_age_issue = true;

        let age = studentPerson.date_of_birth
          ? Moment(school_year.birth_date_cut).diff(studentPerson.date_of_birth, 'years', false)
          : 0;

        if (
          Moment(school_year.birth_date_cut).format('MM/DD') < Moment(studentPerson.date_of_birth).format('MM/DD') &&
          age != 0
        )
          age -= 1;
        const grade_age = parseGradeLevel(grade_level);

        if (studentPerson.date_of_birth && grade_age != 0) {
          if (age != grade_age) is_age_issue = true;
        }
      }

      const studentPacket = await this.packetsService.createOrUpdate({
        packet_id: g_packet_id,
        student_id,
        deadline: packetData ? packetData.deadline.toISOString() : new Date().toISOString(),
        date_accepted: null,
        date_submitted: new Date(),
        date_last_submitted: new Date(),
        secondary_contact_first: packet.secondary_contact_first,
        secondary_contact_last: packet.secondary_contact_last,
        school_district: packet.school_district,
        meta: packet.meta,
        signature_file_id,
        status: status,
        is_age_issue: is_age_issue,
      });

      return {
        student,
        packet: studentPacket,
      };
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
    }
  }

  async savePersoanl(enrollmentPacketPersonalInput: EnrollmentPacketPersonalInput): Promise<EnrollmentPacket> {
    const { packet_id } = enrollmentPacketPersonalInput;
    const packet = await this.packetsService.findOneById(packet_id);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');

    const { person_id } = student;
    const StudentPerson = this.personsService.findOneById(person_id);

    if (!StudentPerson) throw new ServiceUnavailableException('StudentPerson Not Found');

    try {
      await this.personsService.update({
        person_id,
        date_of_birth: enrollmentPacketPersonalInput.birth_date,
        gender: enrollmentPacketPersonalInput.gender,
      });

      const {
        birth_place,
        birth_country,
        race,
        hispanic,
        language,
        language_first_learned,
        language_home,
        language_home_child,
        language_friends,
        language_home_preferred,
        household_size,
        household_income,
        worked_in_agriculture,
        military,
        work_move,
        living_location,
        lives_with,
      } = enrollmentPacketPersonalInput;

      await this.packetsService.createOrUpdate({
        packet_id,
        student_id,
        birth_place,
        birth_country,
        date_submitted: new Date(),
        date_last_submitted: new Date(),
        race,
        hispanic,
        language,
        language_first_learned,
        language_home,
        language_home_child,
        language_friends,
        language_home_preferred,
        household_size,
        household_income,
        worked_in_agriculture,
        military,
        work_move,
        living_location,
        lives_with,
      });
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
    }

    return {
      student,
      packet,
    };
  }

  async saveEducation(enrollmentPacketEducationInput: EnrollmentPacketEducationInput): Promise<EnrollmentPacket> {
    const { packet_id } = enrollmentPacketEducationInput;
    const packet = await this.packetsService.findOneById(packet_id);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');

    try {
      await this.packetsService.createOrUpdate({
        packet_id,
        student_id,
        date_submitted: new Date(),
        date_last_submitted: new Date(),
        school_district: enrollmentPacketEducationInput.school_district,
        special_ed: enrollmentPacketEducationInput.special_ed,
        last_school_type: enrollmentPacketEducationInput.last_school_type,
        last_school: enrollmentPacketEducationInput.last_school,
        last_school_address: enrollmentPacketEducationInput.last_school_address,
        understands_sped_scheduling: enrollmentPacketEducationInput.understands_special_ed || 0,
        permission_to_request_records: enrollmentPacketEducationInput.permission_to_request_records,
      });

      const { school_year_id, grade_level } = enrollmentPacketEducationInput;
      await this.studentGradeLevelsService.createOrUpdate({
        student_id,
        school_year_id,
        grade_level,
      });
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
    }

    return {
      student,
      packet,
    };
  }
  async saveDocument(enrollmentPacketDocumentInput: EnrollmentPacketDocumentInput): Promise<EnrollmentPacket | any> {
    const { packet_id, documents } = enrollmentPacketDocumentInput;
    const packet = await this.packetsService.findOneById(packet_id);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');

    await this.packetFilesService.createMany(packet_id, documents);

    return {
      student,
      packet,
    };
  }
  async deleteEnrollmentPacketDocuments(deleteDocumentsInput: DeleteEnrollmentPacketDocumentsInput): Promise<boolean> {
    const { packetId, mthFileIds } = deleteDocumentsInput;
    const packet = await this.packetsService.findOneById(packetId);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');

    return await this.packetFilesService.deletePacketDocumentsWithMthFileIds(mthFileIds);
  }

  async saveSubmission(
    enrollmentPacketSubmissionInput: EnrollmentPacketSubmissionInput,
  ): Promise<EnrollmentPacket | any> {
    const {
      packet_id,
      agrees_to_policy,
      approves_enrollment,
      photo_permission,
      ferpa_agreement,
      dir_permission,
      signature_name,
      signature_file_id,
    } = enrollmentPacketSubmissionInput;
    const packet = await this.packetsService.findOneById(packet_id);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');

    try {
      await this.packetsService.createOrUpdate({
        packet_id,
        date_submitted: new Date(),
        date_last_submitted: new Date(),
        agrees_to_policy,
        approves_enrollment,
        photo_permission,
        ferpa_agreement,
        dir_permission,
        signature_name,
        signature_file_id,
        status: 'Submitted',
      });
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
    }

    return {
      student,
      packet,
    };
  }

  async runScheduleReminders(): Promise<string> {
    try {
      const MailData = [];
      const emailTemplates = await this.emailTemplateService.findAllByTemplate('Packet Reminders');

      if (emailTemplates.length > 0) {
        emailTemplates.forEach(async (emailTemplate) => {
          const emailReminder = await this.emailReminderService.findByTemplateId(emailTemplate.id);
          if (emailReminder.length > 0) {
            emailReminder.forEach(async (remind) => {
              const reminder = remind.reminder;
              const reminderDate = new Date();
              reminderDate.setDate(reminderDate.getDate() + reminder);
              const packets = await this.packetsService.findReminders(reminderDate, reminder, emailTemplate.region_id);
              if (emailTemplate) {
                await Promise.all(
                  packets.map(async (packet) => {
                    // remove sending duplicate mail
                    const pack_ids = Object.keys(MailData);
                    const duplicate = pack_ids.map((b) => {
                      if (parseInt(b) == packet.packet_id && MailData[b] == remind.reminder_id) {
                        return true;
                      }
                    });
                    if (!duplicate.includes(true)) {
                      MailData[packet.packet_id] = remind.reminder_id;

                      const webAppUrl = process.env.WEB_APP_URL;
                      const student = packet.student.person;
                      const parent = packet.student.parent.person;
                      const school_year = packet.student.applications[0].school_year;
                      const currApplication = packet.student.applications[0];
                      const email = packet.student.parent.person.email;

                      const setAdditionalLinksInfo = (content) => {
                        const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
                        const yearend = new Date(school_year.date_end).getFullYear().toString();

                        const yearText = currApplication.midyear_application
                          ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
                          : `${yearbegin}-${yearend.substring(2, 4)}`;

                        const link = `${webAppUrl}/homeroom/enrollment/${packet.student.student_id}`;
                        return content
                          .toString()
                          .replace(/\[STUDENT\]/g, student.first_name)
                          .replace(/\[PARENT\]/g, parent.first_name)
                          .replace(/\[YEAR\]/g, yearText)
                          .replace(/\[APPLICATION_YEAR\]/g, yearText)
                          .replace(/\[DEADLINE\]/g, `${Moment(packet.deadline).format('MM/DD/yy')}`)
                          .replace(/\[LINK\]/g, `<a href='${link}'>${link}</a>`);
                      };

                      const body = setAdditionalLinksInfo(remind.body || emailTemplate.body);
                      const emailSubject = setAdditionalLinksInfo(remind.subject || emailTemplate.subject);

                      await this.sesEmailService.sendEmail({
                        email: email,
                        subject: emailSubject,
                        content: body,
                        bcc: emailTemplate.bcc,
                        from: emailTemplate.from,
                        template_name: 'Packet Reminders',
                        region_id: emailTemplate.region_id,
                      });
                    }
                  }),
                );
              }
            });
          }
        });
      }
      return 'Successfully run schedule reminders.';
    } catch (error) {
      return error;
    }
  }
}
