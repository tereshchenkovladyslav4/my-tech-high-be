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
import { Person } from './models/person.entity';
import { CreateApplicationInput } from './dto/new-application.inputs';
import { CreateParentPersonInput } from './dto/new-parent-person.inputs';
import { omit } from 'lodash';
import { CreateStudentPersonInput } from './dto/new-student-person.inputs';
import { Student } from './models/student.entity';
import { StudentGradeLevelsService } from './services/student-grade-levels.service';
import { CreateStudentApplicationsInput } from './dto/new-student-applications.inputs';
import { User } from './models/user.entity';
import { createQueryBuilder } from 'typeorm';
import { SESService } from './services/ses.service';
import { EmailsService } from './services/emails.service';
import { EmailVerifierService } from './services/email-verifier.service';
import { UserRegionService } from './services/user-region.service';
import { EmailTemplatesService } from '../applications/services/email-templates.service';
import { Application } from './models/application.entity';
import { StudentStatusService } from './services/student-status.service';
import { ApplicationUserRegion } from './models/user-region.entity';

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
    private SESService: SESService,
    private emailsService: EmailsService,
    private emailVerifierService: EmailVerifierService,
    private userRegionService: UserRegionService,
    private emailTemplateService: EmailTemplatesService,
    private studentStatusService: StudentStatusService,
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

  async createNewApplication(
    newApplication: CreateApplicationInput,
  ): Promise<ParentApplication> {
    const parent = await this.createParentPerson(
      newApplication.parent,
      Number(newApplication.state),
    );

    const parent_id = parent && (await parent).parent_id;
    const studentApplications = (await newApplication).students;

    let students = [];

    students = await studentApplications.map(
      async (studentApplication) =>
        await this.createStudentApplication(
          parent_id,
          newApplication.program_year,
          studentApplication,
          newApplication.referred_by,
          newApplication.meta,
        ),
    );

    const emailVerifier = await this.emailVerifierService.create({
      user_id: this.user.user_id,
      email: this.user.email,
      verification_type: 0,
    });

    if (!emailVerifier)
      throw new ServiceUnavailableException('EmailVerifier Not Created');
    console.log('EmailVerifier: ', emailVerifier);

    await this.emailsService.sendAccountVerificationEmail(emailVerifier, {
      recipients: newApplication.parent.email,
    });

    const emailTemplate =
      await this.emailTemplateService.findByTemplateAndRegion(
        'Application Received',
        Number(newApplication.state),
      );
    if (emailTemplate) {
      await this.emailsService.sendEmail({
        email: newApplication.parent.email,
        subject: emailTemplate.subject,
        content: emailTemplate.body,
        bcc: emailTemplate.bcc,
        from: emailTemplate.from,
      });
    }
    return {
      parent,
      students,
    };
  }

  async createNewStudentApplications(
    user: User,
    newApplication: CreateStudentApplicationsInput,
  ): Promise<ParentApplication> {
    console.log('User: ', user);

    const parent = await createQueryBuilder(Parent)
      .innerJoinAndSelect(
        Person,
        'person',
        'person.person_id = `Parent`.person_id',
      )
      .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
      .where('user.user_id = :userId', { userId: user.user_id })
      .printSql()
      .getOne();
    const studentApplications = (await newApplication).students;
    let students = [];
    students = await studentApplications.map(
      async (studentApplication) =>
        await this.createStudentApplication(
          parent.parent_id,
          newApplication.program_year,
          studentApplication,
          '',
          newApplication.meta,
        ),
    );

    const person = await this.personsService.findOneById(parent.person_id);
    const regions: ApplicationUserRegion[] =
      await this.userRegionService.findUserRegionByUserId(person.user_id);

    var region_id = 0;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate =
      await this.emailTemplateService.findByTemplateAndRegion(
        'Application Received',
        region_id,
      );
    if (emailTemplate) {
      await this.emailsService.sendEmail({
        email: person?.email,
        subject: emailTemplate.subject,
        content: emailTemplate.body,
        bcc: emailTemplate.bcc,
        from: emailTemplate.from,
      });
    }

    return {
      parent,
      students,
    };
  }

  async createParentPerson(
    parentPerson: CreateParentPersonInput,
    region: number,
  ): Promise<Parent> {
    const hasUser = await this.usersService.findOneByEmail(parentPerson.email);
    if (hasUser) throw new ServiceUnavailableException('Email Already Exist!');

    const personInput = omit(parentPerson, ['phone_number']);
    console.log(personInput);
    const person = await this.personsService.create(personInput);
    if (!person) throw new ServiceUnavailableException('Person Not Created');
    console.log('Person: ', person);

    const { person_id } = person;
    const parent = await this.parentsService.create({ person_id });
    if (!parent) throw new ServiceUnavailableException('Parent Not Created');
    console.log('Parent: ', parent);

    const phone = await this.phonesService.create({
      person_id,
      number: parentPerson.phone_number,
    });
    if (!phone) throw new ServiceUnavailableException('Phone Not Created');
    console.log('Phone: ', phone);

    const password = this.generatePassword();
    console.log('Password: ', password);
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
    console.log('User: ', user);

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
    if (!updatedPerson)
      throw new ServiceUnavailableException('Person User ID Not been Updated');
    console.log('Updated Person: ', updatedPerson);

    return parent;
  }

  async createStudentApplication(
    parent_id: number,
    school_year_id: number,
    studentApplication: CreateStudentPersonInput,
    referred_by?: string,
    meta?: string,
  ): Promise<any> {
    const { first_name, last_name, grade_level } = studentApplication;
    const studentApplicationInput = omit(studentApplication, ['grade_level']);
    const person = await this.personsService.create(studentApplicationInput);
    if (!person) throw new ServiceUnavailableException('Person Not Created');
    console.log('Person: ', person);

    const { person_id } = person;
    const student = await this.studentsService.create({
      parent_id,
      person_id,
      grade_level,
    });
    if (!student) throw new ServiceUnavailableException('Student Not Created');
    console.log('Student: ', student);

    const { student_id } = student;
    const student_grade_level =
      await this.studentGradeLevelsService.createOrUpdate({
        student_id,
        school_year_id,
        grade_level,
      });
    if (!student_grade_level)
      throw new ServiceUnavailableException('Student Grade Level Not Created');
    console.log('Student Grade Level: ', student);

    const application = await this.studentApplicationsService.create({
      student_id,
      school_year_id,
      referred_by,
      meta,
    });
    if (!application)
      throw new ServiceUnavailableException('Application Not Created');
    console.log('Application: ', student);

    const statudUpdated = this.studentStatusService.update({
      student_id: student_id,
      school_year_id: school_year_id,
      status: 5,
    });

    return { ...student, person: person, status: statudUpdated };
  }

  async deleteStudentApplication(
    application_ids: string[],
  ): Promise<Application[]> {
    const applications = await this.studentApplicationsService.findByIds(
      application_ids,
    );
    await application_ids.map(async (application_id) => {
      const application = await this.studentApplicationsService.findOneById(
        Number(application_id),
      );

      if (!application)
        throw new ServiceUnavailableException('Application Not Found');
      const student = await this.studentsService.findOneById(
        application.student_id,
      );
      if (!student) throw new ServiceUnavailableException('Student Not Found');

      const deletedStudent = await this.studentsService.delete(
        student.student_id,
      );
      if (!deletedStudent)
        throw new ServiceUnavailableException('Student Not Deleted');

      const deletedStudentGradeLevel =
        await this.studentGradeLevelsService.delete(
          student.student_id,
          application.school_year_id,
        );
      if (!deletedStudentGradeLevel)
        throw new ServiceUnavailableException('StudentGradeLevel Not Deleted');

      const deletePerson = await this.personsService.delete(student.person_id);
      if (!deletePerson)
        throw new ServiceUnavailableException('Person Not Deleted');

      const studentApplication = await this.studentApplicationsService.delete(
        Number(application_id),
      );
      if (!studentApplication)
        throw new ServiceUnavailableException('Application Not Deleted');
    });
    return applications;
  }

  async createObserPerson() {}
}
