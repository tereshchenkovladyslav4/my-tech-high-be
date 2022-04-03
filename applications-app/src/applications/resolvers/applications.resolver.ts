import { Args, ID, Query, Resolver, ResolveReference, Mutation, ResolveField, Parent, Context, Int } from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { User } from '../models/user.entity';
import { SchoolYear } from '../models/schoolyear.entity';
import { Application } from '../models/application.entity';
import { StudentsService } from '../services/students.service';
import { ApplicationsService } from '../services/applications.service';
import { SchoolYearService } from '../services/schoolyear.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApplicationsArgs } from '../dto/applications.args';
import { CreateStudentApplicationInput } from '../dto/new-student-application.inputs';
import { ParentApplication } from '../models/parent-application.entity';
import { CreateApplicationInput } from '../dto/new-application.inputs';
import { ApplicationsService as StudentApplicationsService } from '../applications.service';
import { CreateParentStudentInput } from '../dto/new-parent-student.inputs';
import { AcceptApplicationInput } from '../dto/accept-application.inputs';
import { Pagination } from '../../paginate';
import { ApplicationPagination } from '../models/application-pagination.entity';
import { CreateStudentApplicationsInput } from '../dto/new-student-applications.inputs';
import { ApplicationEmail } from '../models/application-email.entity';
import { ApplicationEmailsService } from '../services/application-emails.service';
import { DeleteApplicationInput } from '../dto/delete-application.inputs';
import { EmailApplicationInput } from '../dto/email-application.inputs';
import { UpdateApplicationInput } from "../dto/update-application.inputs";
import { UpdateImmunizationSettingsInput } from '../dto/update-immunization-settings.input';
import { ImmunizationSettingsService } from '../services/immunization-settings.service';
import { ImmunizationSettings } from '../models/immunization-settings.entity';
import { updateImmunizationOrderInput } from '../dto/update-immunization-order.input';
import { UsersService } from '../services/users.service';

@Resolver((of) => Application)
export class ApplicationsResolver {
  constructor(
    private applicationsService: ApplicationsService,
    private studentsService: StudentsService,
    private schoolYearService: SchoolYearService,
    private studentApplicationsService: StudentApplicationsService,
    private applicationEmailsService: ApplicationEmailsService,
    private immunizationSettingsService: ImmunizationSettingsService,
    private usersService: UsersService,
    ) {}

  @Query((returns) => ApplicationPagination, { name: 'applications' })
  //@UseGuards(new AuthGuard())
  async getApplications(@Args() applicationsArgs: ApplicationsArgs): Promise<Pagination<Application>> {
    const results = await this.applicationsService.findAll(applicationsArgs);
    console.log(results);
    return results;
  }

  @Query((returns) => Application, { name: 'application' })
  @UseGuards(new AuthGuard())
  async getApplication(@Args({ name: 'application_id', type: () => ID }) application_id: number): Promise<Application> {
    return this.applicationsService.findOneById(application_id);
  }

  @Query((returns) => [SchoolYear], { name: 'schoolYears' })
  // @UseGuards(new AuthGuard())
  async findAllSchoolYear(): Promise<SchoolYear[]> {
    return this.schoolYearService.findAll();
  }

  @Mutation((returns) => Application, { name: 'createApplication' } )
  @UseGuards(new AuthGuard())
  async addApplication(
    @Context('user') user: User,
    @Args('createApplicationInput') createApplicationInput: CreateStudentApplicationInput,
  ): Promise<Application> {
    return await this.applicationsService.create(createApplicationInput);
  }

  @Mutation((returns) => ParentApplication, { name: 'createNewApplication' } )
  async addNewApplication(
    @Args('createApplicationInput') createApplicationInput: CreateApplicationInput,
  ): Promise<ParentApplication> {
    return await this.studentApplicationsService.createNewApplication(createApplicationInput);
  }

  @Mutation((returns) => ParentApplication, { name: 'createNewStudentApplication' } )
  @UseGuards(new AuthGuard())
  async addNewStudentApplication(
    @Context('user') user: any,
    @Args('createApplicationInput') createApplicationInput: CreateStudentApplicationsInput,
  ): Promise<ParentApplication> {

    if (user) {
      const authUser = await this.usersService.findOneByEmail(user.username);
      if( !authUser )
        throw new UnauthorizedException();

      return await this.studentApplicationsService.createNewStudentApplications(authUser, createApplicationInput);
    } else {
      throw new UnauthorizedException();
    }

    
  }

  @Mutation((returns) => [Application], { name: 'acceptApplication' } )
  async acceptApplication(
    @Args('acceptApplicationInput') acceptApplicationInput: AcceptApplicationInput,
  ): Promise<Application[]> {
    return await this.applicationsService.acceptApplication(acceptApplicationInput);
  }

  @ResolveField((of) => Student, { name: 'student' })
  async getStudent(@Parent() application: Application): Promise<Student> {
    return await this.studentsService.findOneById(application.student_id);
  }

  @ResolveField((of) => SchoolYear, { name: 'school_year' })
  getSchoolYear(@Parent() application: Application): Promise<SchoolYear> {
    return this.schoolYearService.findOneById(application.school_year_id);
  }

  @ResolveField((of) => [ApplicationEmail], { name: 'application_emails' })
  public async getApplicationEmails(@Parent() application: Application): Promise<ApplicationEmail[]> {
    return this.applicationEmailsService.findByApplication(application.application_id)
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; application_id: number }): Promise<Application> {
    return this.applicationsService.findOneById(reference.application_id);
  }

  @Mutation((returns) => [Application], { name: 'deleteApplication' })
  async deleteApplication(
    @Args('deleteApplicationInput') deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Application[]> {
    return await this.applicationsService.deleteApplication(deleteApplicationInput);
  }

  @Mutation((returns) => [ApplicationEmail], { name: 'emailApplication' })
  async emailApplication(
    @Args('emailApplicationInput') emailApplicationInput: EmailApplicationInput,
  ): Promise<ApplicationEmail[]> {
    return await this.applicationsService.sendEmail(emailApplicationInput);
  }

  @Mutation((returns) => Boolean, { name: 'moveThisYearApplication' })
  async moveThisYearApplication(
    @Args('deleteApplicationInput') deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
    return await this.applicationsService.moveThisYearApplication(deleteApplicationInput);
  }

  @Mutation((returns) => Boolean, { name: 'moveNextYearApplication' })
  async moveNextYearApplication(
    @Args('deleteApplicationInput') deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
    return await this.applicationsService.moveNextYearApplication(deleteApplicationInput);
  }

  @Mutation((returns) => Application, { name: 'updateApplication' })
  async updateApplication(
    @Args('updateApplicationInput') updateApplicationInput: UpdateApplicationInput,
  ): Promise<Application> {
    return await this.applicationsService.updateApplication(updateApplicationInput);
  }

  @Mutation((returns) => Application, { name: 'toggleHideApplication' })
  async toggleHideApplication(
    @Args('updateApplicationInput') updateApplicationInput: UpdateApplicationInput,
  ): Promise<Application> {
    return await this.applicationsService.toggleHideApplication(updateApplicationInput);
  }

  @Mutation((returns) => ImmunizationSettings, {
    name: 'saveImmunizationSettings',
  })
  async saveImmunizationSettings(
    @Args('updateImmunizationSettingsInput')
    updateImmunizationSettingsInput: UpdateImmunizationSettingsInput,
  ): Promise<ImmunizationSettings> {
    return await this.immunizationSettingsService.updateOrAdd(
      updateImmunizationSettingsInput,
    );
  }

  @Mutation((returns) => Boolean, {
    name: 'deleteImmunizationSetting',
  })
  async deleteImmunizationSetting(
    @Args({name: 'id', type: () => Int})
    id: number,
  ): Promise<boolean> {
    return await this.immunizationSettingsService.deleteOne(id);
  }

  @Mutation((returns) => Boolean, {
    name: 'updateImmunizationOrder',
  })
  async updateImmunizationOrder(
    @Args({name: 'ids', type: () => updateImmunizationOrderInput})
    input: updateImmunizationOrderInput,
  ): Promise<boolean> {
    this.immunizationSettingsService.updateOrder(input.ids)
    return true
  }
}
