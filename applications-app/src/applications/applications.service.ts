import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ApplicationsService as StudentApplicationsService } from './services/applications.service';
import { ParentsService } from './services/parents.service';
import { PersonsService } from './services/persons.service';
import { PhonesService } from './services/phones.service';
import { StudentsService } from './services/students.service';
import { UsersService } from './services/users.service';
import { ParentApplication } from './models/parent-application.entity';
import { Parent } from './models/parent.entity';
import { Person } from './models/person.entity';
import { CreateApplicationInput } from './dto/new-application.inputs';
import { CreateParentPersonInput } from './dto/new-parent-person.inputs';
import { omit } from 'lodash';
import { Student } from './models/student.entity';
import { StudentGradeLevelsService } from './services/student-grade-levels.service';
import { CreateStudentApplicationsInput } from './dto/new-student-applications.inputs';
import { User } from './models/user.entity';
import { createQueryBuilder } from 'typeorm';
import { EmailsService } from './services/emails.service';
import { EmailVerifierService } from './services/email-verifier.service';
import { UserRegionService } from './services/user-region.service';
import { EmailTemplatesService } from '../applications/services/email-templates.service';
import { Application } from './models/application.entity';
import { StudentStatusService } from './services/student-status.service';
import { UserRegion } from './models/user-region.entity';
import { SchoolYearService } from './services/schoolyear.service';
import { PersonAddressService } from './services/person-address.service';
import { SchoolYear } from './models/schoolyear.entity';
import { CreateStudentApplicationInput } from './dto/create-student-application.inputs';
import { EmailTemplateEnum } from './enums';

@Injectable()
export class ApplicationsService {
  constructor(
    private studentApplicationsService: StudentApplicationsService,
    private parentsService: ParentsService,
    private personsService: PersonsService,
    private phonesService: PhonesService,
    private usersService: UsersService,
    private studentsService: StudentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private emailsService: EmailsService,
    private schoolYearService: SchoolYearService,
    private emailVerifierService: EmailVerifierService,
    private userRegionService: UserRegionService,
    private emailTemplateService: EmailTemplatesService,
    private studentStatusService: StudentStatusService,
    private personAddressService: PersonAddressService,
  ) {}

  protected user: User;

  protected NewUser;

  generatePassword() {
    const characterList = 'mthv2@2022';
    let password = '';
    const characterListLength = characterList.length;

    for (let i = 0; i < 8; i++) {
      const characterIndex = Math.round(Math.random() * characterListLength);
      password = password + characterList.charAt(characterIndex);
    }
    return password;
  }

  async createNewApplication(newApplication: CreateApplicationInput): Promise<ParentApplication> {
    const parent = await this.createParentPerson(newApplication.parent, Number(newApplication.state));
    const parent_id = parent && (await parent).parent_id;
    const studentApplications = (await newApplication).students;

    let students = [];

    students = await Promise.all(
      studentApplications.map(
        async (studentApplication) =>
          await this.createStudentApplication({
            parent_id,
            school_year_id: newApplication.program_year,
            studentApplication,
            referred_by: newApplication.referred_by,
            meta: newApplication.meta,
            address: newApplication.address,
            packet: newApplication.packet,
            midyear_application: newApplication.midyear_application,
            parent_person_id: parent.person_id,
          }),
      ),
    );

    const emailVerifier = await this.emailVerifierService.create({
      user_id: this.user.user_id,
      email: this.user.email,
      verification_type: 0,
    });

    if (!emailVerifier) {
      throw new ServiceUnavailableException('EmailVerifier Not Created');
    }
    await this.emailsService.sendAccountVerificationEmail(emailVerifier, {
      recipients: newApplication.parent.email,
    });

    return {
      parent,
      students,
    };
  }

  async sendApplicationRecieveEmail(email: string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    const regions = await this.userRegionService.findUserRegionByUserId(user.user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }
    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion(
      EmailTemplateEnum.APPLICATION_RECEIVED,
      region_id,
    );
    if (emailTemplate) {
      const person = await this.personsService.findOneByUserId(user.user_id);
      const parent = await this.parentsService.findOneByEmail(email);

      const students = await this.studentsService.findOneByParent(parent.parent_id);

      const setAdditionalLinksInfo = async (content: string, school_year: SchoolYear, student: Student) => {
        const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
        const yearend = new Date(school_year.date_end).getFullYear().toString();

        const currApplication = await this.studentApplicationsService.findBySchoolYearAndStudent({
          school_year_id: school_year.school_year_id,
          student_id: student.student_id,
        });

        const yearText = currApplication.midyear_application
          ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
          : `${yearbegin}-${yearend.substring(2, 4)}`;

        return content
          .toString()
          .replace(/\[STUDENT\]/g, student.person.first_name)
          .replace(/\[PARENT\]/g, person.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[APPLICATION_YEAR\]/g, yearText);
      };

      if (students.length > 0) {
        students.forEach(async (student) => {
          const gradeLevels = await this.studentGradeLevelsService.forStudents(student.student_id);

          const school_year = await this.schoolYearService.findOneById(gradeLevels[0]?.school_year_id);

          const emailBody = await setAdditionalLinksInfo(emailTemplate.body, school_year, student);
          const emailSubject = await setAdditionalLinksInfo(emailTemplate.subject, school_year, student);
          await this.emailsService.sendEmail({
            email: email,
            subject: emailSubject,
            content: emailBody,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
            region_id: region_id,
            template_name: 'Application Received',
          });
        });
      }
      return true;
    } else {
      return false;
    }
  }

  async createNewStudentApplications(
    user: User,
    newApplication: CreateStudentApplicationsInput,
  ): Promise<ParentApplication> {
    const parent = await createQueryBuilder(Parent)
      .innerJoinAndSelect(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
      .where('user.user_id = :userId', { userId: user.user_id })
      .printSql()
      .getOne();
    const studentApplications = (await newApplication).students;
    let students = [];

    students = await Promise.all(
      studentApplications.map(
        async (studentApplication) =>
          await this.createStudentApplication({
            parent_id: parent.parent_id,
            school_year_id: newApplication.program_year,
            studentApplication,
            referred_by: '',
            meta: newApplication.meta,
            midyear_application: newApplication.midyear_application,
          }),
      ),
    );

    const person = await this.personsService.findOneById(parent.person_id);
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(person.user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion(
      EmailTemplateEnum.APPLICATION_RECEIVED,
      region_id,
    );

    if (emailTemplate) {
      const setAdditionalLinksInfo = async (content, school_year, student) => {
        const currApplication = await this.studentApplicationsService.findBySchoolYearAndStudent({
          school_year_id: school_year.school_year_id,
          student_id: student.student_id,
        });
        const yearbegin = new Date(school_year.date_begin).getFullYear().toString();

        const yearend = new Date(school_year.date_end).getFullYear().toString();
        const yearText = currApplication.midyear_application
          ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
          : `${yearbegin}-${yearend.substring(2, 4)}`;

        return content
          .toString()
          .replace(/\[STUDENT\]/g, student.person.first_name)
          .replace(/\[PARENT\]/g, person.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[APPLICATION_YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`);
      };

      if (students.length > 0) {
        students.forEach(async (student) => {
          const gradeLevels = await this.studentGradeLevelsService.forStudents(student.student_id);

          const school_year = await this.schoolYearService.findOneById(gradeLevels[0]?.school_year_id);

          const emailBody = await setAdditionalLinksInfo(emailTemplate.body, school_year, student);
          const emailSubject = await setAdditionalLinksInfo(emailTemplate.subject, school_year, student);

          await this.emailsService.sendEmail({
            email: person?.email,
            subject: emailSubject,
            content: emailBody,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
            region_id: region_id,
            template_name: 'Application Received',
          });
        });
      }
    }

    return {
      parent,
      students,
    };
  }

  async createParentPerson(parentPerson: CreateParentPersonInput, region: number): Promise<Parent> {
    const hasUser = await this.usersService.findOneByEmail(parentPerson.email);
    if (hasUser) throw new ServiceUnavailableException('Email Already Exist!');

    const personInput = omit(parentPerson, ['phone_number']);
    const person = await this.personsService.create(personInput);
    if (!person) throw new ServiceUnavailableException('Person Not Created');

    const { person_id } = person;
    const parent = await this.parentsService.create({ person_id });
    if (!parent) throw new ServiceUnavailableException('Parent Not Created');

    const phone = await this.phonesService.create({
      person_id,
      number: parentPerson.phone_number,
    });
    if (!phone) throw new ServiceUnavailableException('Phone Not Created');

    const password = this.generatePassword();
    const user = await this.usersService.create({
      firstName: parentPerson.first_name,
      lastName: parentPerson.last_name,
      email: parentPerson.email,
      level: 15,
      updateAt: new Date().toString(),
      password,
    });
    this.user = user;
    this.NewUser = {
      email: user.email,
      password: password,
    };
    if (!user) throw new ServiceUnavailableException('User Not Created');

    const { user_id } = user;
    const updatedPerson = await this.personsService.updateUserId({
      person_id,
      user_id,
    });
    const regionPayload = {
      user_id: user_id,
      region_id: [region],
    };
    await this.userRegionService.createUserRegion(regionPayload);
    if (!updatedPerson) throw new ServiceUnavailableException('Person User ID Not been Updated');
    return parent;
  }

  async createStudentApplication(createStudentApplicationInput: CreateStudentApplicationInput): Promise<any> {
    const {
      parent_id,
      school_year_id,
      studentApplication,
      referred_by,
      meta,
      address,
      packet,
      midyear_application,
      parent_person_id,
    } = createStudentApplicationInput;
    const { grade_level, meta: studentMeta } = studentApplication;
    const studentApplicationInput = omit(studentApplication, ['grade_level', 'meta', 'address', 'packet']);
    const person = await this.personsService.create(studentApplicationInput);
    if (!person) throw new ServiceUnavailableException('Person Not Created');

    const parentPerson = await this.personsService.findOneById(parent_person_id);

    const personAddress = await this.personAddressService.createOrUpdate(parentPerson, {
      ...address,
      ...studentApplication.address,
    });
    if (!personAddress) throw new ServiceUnavailableException('PersonAddress Not Created');

    const { person_id } = person;
    // Get Current Speical ED
    let special_ed = 0;
    const student_meta = JSON.parse(studentMeta);
    if ('meta_special_education' in student_meta) {
      special_ed = Number(student_meta['meta_special_education']);
    }

    const student = await this.studentsService.create({
      parent_id,
      person_id,
      special_ed,
      grade_level,
    });
    if (!student) throw new ServiceUnavailableException('Student Not Created');

    const { student_id } = student;
    const student_grade_level = await this.studentGradeLevelsService.createOrUpdate({
      student_id,
      school_year_id,
      grade_level,
    });
    if (!student_grade_level) throw new ServiceUnavailableException('Student Grade Level Not Created');

    const application_meta = JSON.stringify({
      ...JSON.parse(meta),
      ...JSON.parse(studentMeta),
    });
    const application = await this.studentApplicationsService.create({
      student_id,
      school_year_id,
      referred_by,
      meta: application_meta,
      secondary_contact_first:
        studentApplication?.packet?.secondary_contact_first || packet?.secondary_contact_first || null,
      secondary_contact_last:
        studentApplication?.packet?.secondary_contact_last || packet?.secondary_contact_last || null,
      midyear_application: midyear_application,
    });
    if (!application) throw new ServiceUnavailableException('Application Not Created');

    student.applications?.push(application);

    const statudUpdated = await this.studentStatusService.update({
      student_id: student_id,
      school_year_id: school_year_id,
      status: 5,
    });

    return { ...student, person: person, status: statudUpdated };
  }

  async deleteStudentApplication(application_ids: string[]): Promise<Application[]> {
    const applications = await this.studentApplicationsService.findByIds(application_ids);
    await application_ids.map(async (application_id) => {
      const application = await this.studentApplicationsService.findOneById(Number(application_id));

      if (!application) throw new ServiceUnavailableException('Application Not Found');
      const student = await this.studentsService.findOneById(application.student_id);
      if (!student) throw new ServiceUnavailableException('Student Not Found');

      const deletedStudent = await this.studentsService.delete(student.student_id);
      if (!deletedStudent) throw new ServiceUnavailableException('Student Not Deleted');

      const deletedStudentGradeLevel = await this.studentGradeLevelsService.delete(
        student.student_id,
        application.school_year_id,
      );
      if (!deletedStudentGradeLevel) throw new ServiceUnavailableException('StudentGradeLevel Not Deleted');

      const deletePerson = await this.personsService.delete(student.person_id);
      if (!deletePerson) throw new ServiceUnavailableException('Person Not Deleted');

      const studentApplication = await this.studentApplicationsService.delete(Number(application_id));
      if (!studentApplication) throw new ServiceUnavailableException('Application Not Deleted');
    });
    return applications;
  }
}
