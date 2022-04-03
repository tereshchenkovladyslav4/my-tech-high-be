import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApplicationsService as StudentApplicationsService } from './services/applications.service';
import { ParentsService } from './services/parents.service';
import { PersonsService } from './services/persons.service';
import { PhonesService } from './services/phones.service';
import { StudentsService } from './services/students.service';
import { UsersService } from './services/users.service';
import { ParentApplication } from './models/parent-application.entity';
import { Parent } from './models/parent.entity';
import { CreateApplicationInput } from './dto/new-application.inputs';
import { CreateParentPersonInput } from './dto/new-parent-person.inputs';
import { omit } from 'lodash';
import { CreateStudentPersonInput } from './dto/new-student-person.inputs';
import { Student } from './models/student.entity';
import { StudentGradeLevelsService } from './services/student-grade-levels.service';
import { PacketsService } from './services/packets.service';
import { EnrollmentPacketContactInput } from '../applications/dto/enrollment-packet-contact.inputs';
import { Packet } from './models/packet.entity';
import { EnrollmentPacketPersonalInput } from './dto/enrollment-packet-personal.inputs';
import { EnrollmentPacket } from './models/enrollment-packet.entity';
import { EnrollmentPacketEducationInput } from './dto/enrollment-packet-education.inputs';
import { AddressService } from './services/address.service';
import { PersonAddressService } from './services/person-address.service';
import { S3Service } from './services/s3.service';
import { EnrollmentPacketInput } from './dto/enrollment-packet.inputs';
import { EnrollmentPacketDocumentInput } from './dto/enrollment-packet-document.inputs';
import { createWriteStream } from 'fs';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { SchoolYearService } from './services/schoolyear.service';
import * as Moment from 'moment';
import { PacketFilesService } from './services/packet-files.service';
import { EnrollmentPacketSubmissionInput } from './dto/enrollment-packet-submission.inputs';
import { PersonAddress } from './models/person-address.entity';
import { EmailTemplatesService } from './services/email-templates.service';
import { EmailsService } from './services/emails.service';

const common_1 = require('@nestjs/common');
const templates = {
  Accepted: 'Packet Accepted',
  //   'Missing Info': 'Missing Information',
  //   Reminders: 'Packet Reminders',
};

@Injectable()
export class EnrollmentsService {
  constructor(
    private studentApplicationsService: StudentApplicationsService,
    private parentsService: ParentsService,
    private personsService: PersonsService,
    private phonesService: PhonesService,
    private usersService: UsersService,
    private studentsService: StudentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private packetsService: PacketsService,
    private addressService: AddressService,
    private personAddressService: PersonAddressService,
    private s3Service: S3Service,
    private schoolYearService: SchoolYearService,
    private packetFilesService: PacketFilesService,
    private emailTemplateService: EmailTemplatesService,
    private sesEmailService: EmailsService,
  ) {}

  async saveEnrollmentPacket(
    enrollmentPacketInput: EnrollmentPacketInput,
  ): Promise<EnrollmentPacket> {
    const {
      packet_id,
      admin_notes,
      student_person_id,
      parent_person_id,
      medical_exemption,
      exemption_form_date,
      secondary_contact_first,
      secondary_contact_last,
      secondary_email,
      secondary_phone,
      date_of_birth,
      birth_place,
      birth_country,
      hispanic,
      race,
      gender,
      language,
      language_home,
      language_home_child,
      language_friends,
      language_home_preferred,
      last_school,
      last_school_address,
      last_school_type,
      school_district,
      household_income,
      household_size,
      worked_in_agriculture,
      military,
      ferpa_agreement,
      dir_permission,
      photo_permission,
      status,
      is_age_issue,
      missing_files,
    } = enrollmentPacketInput;

    try {
      if (student_person_id) {
        await this.personsService.update({
          person_id: student_person_id,
          gender: gender,
          date_of_birth: Moment(date_of_birth).toDate(),
        });
      }

      const studentPacket = await this.packetsService.update({
        packet_id: packet_id,
        admin_notes: admin_notes,
        medical_exemption,
        exemption_form_date: exemption_form_date
          ? new Date(exemption_form_date)
          : null,
        secondary_contact_first: secondary_contact_first,
        secondary_contact_last: secondary_contact_last,
        secondary_email: secondary_email,
        secondary_phone: secondary_phone,
        birth_country: birth_country,
        birth_place: birth_place,
        hispanic: hispanic,
        race: race,
        last_school: last_school,
        last_school_address: last_school_address,
        last_school_type: last_school_type,
        household_income: household_income,
        household_size: household_size,
        worked_in_agriculture: worked_in_agriculture,
        military: military,
        ferpa_agreement: ferpa_agreement,
        photo_permission: photo_permission,
        dir_permission: dir_permission,
        school_district: school_district,
        language: language,
        language_home: language_home,
        language_home_child: language_home_child,
        language_friends: language_friends,
        language_home_preferred: language_home_preferred,
        status: status,
        deadline: new Date(),
        date_submitted: new Date(),
        date_last_submitted: new Date(),
        date_accepted: new Date(),
        is_age_issue,
        missing_files,
      });
      if (templates[status]) {
        const emailTemplate = await this.emailTemplateService.findByTemplate(
          templates[status],
        );
        if (emailTemplate) {
          const studentPerson = await this.studentsService.findOneById(
            studentPacket.student_id,
          );
          await this.sesEmailService.sendEmail({
            email: studentPerson.parent?.person?.email,
            subject: emailTemplate.subject,
            content: emailTemplate.body,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
          });
        }
      }

      return {
        packet: studentPacket,
      };
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(
        message,
        common_1.HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private allowed_files = [
    { 'text/plain': 'txt' },
    { 'application/x-shockwave-flash': 'swf' },
    { 'video/x-flv': 'flv' },

    // images
    { 'image/png': 'png' },
    { 'image/jpeg': 'jpg' },
    { 'image/gif': 'gif' },
    { 'image/bmp': 'bmp' },
    { 'image/vnd.microsoft.icon': 'ico' },
    { 'image/tiff': 'tiff' },
    { 'image/svg+xml': 'svg' },

    // archives
    { 'application/zip': 'zip' },
    { 'application/x-rar-compressed': 'rar' },
    { 'application/vnd.ms-cab-compressed': 'cab' },

    // audio/video
    { 'audio/mpeg': 'mp3' },

    // adobe
    { 'application/pdf': 'pdf' },
    { 'image/vnd.adobe.photoshop': 'psd' },
    { 'application/postscript': 'ai' },
    // 'application/postscript' : 'eps'},
    // 'application/postscript' : 'ps'},

    // ms office
    { 'application/msword': 'doc' },
    { 'application/rtf': 'rtf' },
    { 'application/vnd.ms-excel': 'xls' },
    { 'application/vnd.ms-powerpoint': 'ppt' },

    // open office
    { 'application/vnd.oasis.opendocument.text': 'odt' },
    { 'application/vnd.oasis.opendocument.spreadsheet': 'ods' },
  ];

  async saveContacts(
    enrollmentPacketContactInput: EnrollmentPacketContactInput,
  ): Promise<EnrollmentPacket> {
    console.log('Input: ', enrollmentPacketContactInput);
    const { student_id, secondaryParent } = enrollmentPacketContactInput;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');
    console.log('Student: ', student);

    const packet = await this.packetsService.findOneByStudentId(student_id);
    console.log('Enrollment Packet: ', packet);
    const packet_id = (packet && (await packet).packet_id) || null;

    const parentId = (await student).parent_id;
    const parent = this.parentsService.findOneById(parentId);
    if (!parent) throw new ServiceUnavailableException('Parent Not Found');
    console.log('Parent: ', parent);

    const studentPersonId = (await student).person_id;
    const parentPersonId = (await parent).person_id;

    try {
      const parentPerson = await this.personsService.update({
        person_id: parentPersonId,
        ...enrollmentPacketContactInput.parent,
      });
      console.log('Parent Person: ', parentPerson);

      const studentPerson = await this.personsService.update({
        person_id: studentPersonId,
        ...enrollmentPacketContactInput.student,
      });
      console.log('Student Person: ', studentPerson);

      const personAddress = this.personAddressService.createOrUpdate(
        studentPerson,
        enrollmentPacketContactInput.student.address,
      );
      // const street2 = enrollmentPacketContactInput.student.address.street2 || "";
      // const address = await this.addressService.create({...enrollmentPacketContactInput.student.address, street2});
      // console.log("Address: ", address);

      // const address_id = (await address).address_id;
      // const personAddress = await this.personAddressService.create({
      //     person_id: studentPerson.person_id,
      //     address_id
      // });

      console.log('Student Person Address: ', personAddress);

      const phone = await this.phonesService.create({
        person_id: studentPerson.person_id,
        number: enrollmentPacketContactInput.student.phone_number,
      });
      if (!phone)
        throw new ServiceUnavailableException('Student Phone Not Created');
      console.log('Student Phone: ', phone);

      const studentPacket = await this.packetsService.createOrUpdate({
        packet_id,
        student_id,
        status: 'Started',
        deadline: new Date(),
        date_accepted: null,
        date_submitted: null,
        date_last_submitted: null,
        secondary_contact_first: secondaryParent.first_name,
        secondary_contact_last: secondaryParent.last_name,
        secondary_email: secondaryParent.email,
        secondary_phone: secondaryParent.phone_number,
      });
      console.log('Student Packet: ', studentPacket);

      return {
        student,
        packet: studentPacket,
      };
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(
        message,
        common_1.HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async savePersoanl(
    enrollmentPacketPersonalInput: EnrollmentPacketPersonalInput,
  ): Promise<EnrollmentPacket> {
    console.log(enrollmentPacketPersonalInput);

    const { packet_id } = enrollmentPacketPersonalInput;
    const packet = await this.packetsService.findOneById(packet_id);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');
    console.log('Packet: ', packet);

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');
    console.log('Student: ', student);

    const { person_id } = student;
    const StudentPerson = this.personsService.findOneById(person_id);

    if (!StudentPerson)
      throw new ServiceUnavailableException('StudentPerson Not Found');
    console.log('StudentPerson: ', StudentPerson);

    try {
      await this.personsService.update({
        person_id,
        date_of_birth: enrollmentPacketPersonalInput.birth_date,
        gender: enrollmentPacketPersonalInput.gender
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

      const studentPacket = await this.packetsService.createOrUpdate({
        packet_id,
        student_id,
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
      });
      console.log('Student Packet: ', studentPacket);
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(
        message,
        common_1.HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      student,
      packet,
    };
  }

  async saveEducation(
    enrollmentPacketEducationInput: EnrollmentPacketEducationInput,
  ): Promise<EnrollmentPacket> {
    console.log(enrollmentPacketEducationInput);

    const { packet_id } = enrollmentPacketEducationInput;
    const packet = await this.packetsService.findOneById(packet_id);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');
    console.log('Packet: ', packet);

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');
    console.log('Student: ', student);

    try {
      const studentPacket = await this.packetsService.createOrUpdate({
        packet_id,
        student_id,
        school_district: enrollmentPacketEducationInput.school_district,
        special_ed: enrollmentPacketEducationInput.special_ed,
        last_school_type: enrollmentPacketEducationInput.last_school_type,
        last_school: enrollmentPacketEducationInput.last_school,
        last_school_address: enrollmentPacketEducationInput.last_school_address,
        understands_sped_scheduling:
          enrollmentPacketEducationInput.understands_special_ed || 0,
      });
      console.log('Student Packet: ', studentPacket);

      const { school_year_id, grade_level } = enrollmentPacketEducationInput;
      const studentGradeLevel =
        await this.studentGradeLevelsService.createOrUpdate({
          student_id,
          school_year_id,
          grade_level,
        });

      console.log('Student Grade Level: ', studentGradeLevel);
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(
        message,
        common_1.HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      student,
      packet,
    };
  }
  async saveDocument(
    enrollmentPacketDocumentInput: EnrollmentPacketDocumentInput,
  ): Promise<EnrollmentPacket | any> {
    const { packet_id, documents } = enrollmentPacketDocumentInput;
    const packet = await this.packetsService.findOneById(packet_id);

    if (!packet) throw new ServiceUnavailableException('Packet Not Found');
    //console.log("Packet: ", packet);

    const { student_id } = packet;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) throw new ServiceUnavailableException('Student Not Found');
    console.log('Student: ', student);

    await this.packetFilesService.createMany(packet_id, documents);

    return {
      student,
      packet,
    };
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
      const studentPacket = await this.packetsService.createOrUpdate({
        packet_id,
        agrees_to_policy,
        approves_enrollment,
        photo_permission,
        ferpa_agreement,
        dir_permission,
        signature_name,
        signature_file_id,
        status: 'Submitted',
      });
      console.log('Student Packet: ', studentPacket);
    } catch (err) {
      const message = 'Update error: ' + (err.message || err.name);
      throw new common_1.HttpException(
        message,
        common_1.HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      student,
      packet,
    };
  }

  async runScheduleReminders(): Promise<String> {
    try {
      const emailTemplate = await this.emailTemplateService.findByTemplate(
        'Packet Reminders',
      );
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() - 5);
      if (emailTemplate) {
        const emails = await this.packetsService.findReminders(deadlineDate);
        await Promise.all(
          emails.map(async (email) => {
            await this.sesEmailService.sendEmail({
              email: email,
              subject: emailTemplate.subject,
              content: emailTemplate.body,
              bcc: emailTemplate.bcc,
              from: emailTemplate.from,
            });
          }),
        );
      }
      return 'Successfully run schedule reminders.';
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
