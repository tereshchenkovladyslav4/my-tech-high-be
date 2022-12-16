import { Args, ID, Query, Resolver, ResolveReference, Mutation, ResolveField, Parent, Context } from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { User } from '../models/user.entity';
import { StudentsService } from '../services/students.service';
import { ApplicationsService } from '../services/applications.service';
import { SchoolYearService } from '../services/schoolyear.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApplicationsService as StudentApplicationsService } from '../applications.service';
import { Packet } from '../models/packet.entity';
import { PacketEmail } from '../models/packet-email.entity';
import { PacketsService } from '../services/packets.service';
import { EnrollmentPacketContactInput } from '../dto/enrollment-packet-contact.inputs';
import { EnrollmentPacketPersonalInput } from '../dto/enrollment-packet-personal.inputs';
import { PacketsArgs } from '../dto/packets.args';
import { EnrollmentsService } from '../enrollments.service';
import { EnrollmentPacket } from '../models/enrollment-packet.entity';
import { EnrollmentPacketEducationInput } from '../dto/enrollment-packet-education.inputs';
import { PacketPagination } from '../models/packet-pagination.entity';
import { Pagination } from '../../paginate';
import { PacketFile } from '../models/packet-file.entity';
import { PacketFilesService } from '../services/packet-files.service';
import { ResponseDTO } from '../dto/response.dto';
import { ImmunizationSettingsService } from '../services/immunization-settings.service';
import { ImmunizationSettings } from '../models/immunization-settings.entity';
import { ImmunizationSettingsData } from '../models/immunization-settings-data.entity';
import { FilesService } from '../services/files.service';
import { File } from '../models/file.entity';
import { DeleteFileArgs, FileData } from '../models/file-data.entity';
import { EnrollmentPacketInput } from '../dto/enrollment-packet.inputs';
import { EmailsService } from '../services/emails.service';
import { EmailInput } from '../dto/email.inputs';
import { EnrollmentPacketDocumentInput } from '../dto/enrollment-packet-document.inputs';
import { EnrollmentPacketSubmissionInput } from '../dto/enrollment-packet-submission.inputs';
import { DeleteApplicationInput } from '../dto/delete-application.inputs';
import { EmailApplicationInput } from '../dto/email-application.inputs';
import { FindImmunizationSettingsInput } from '../dto/find-immunization';
import { PacketEmailsService } from '../services/packet-emails.service';
import { EnrollmentPacketSubmitInput } from '../dto/enrollment-packet-submit.input';
import { UpdateSchoolYearIdsInput } from '../dto/school-update-application.inputs';
import { StudentPacketPDFInput } from '../dto/generate-student-packet-pdf.input';
import { PacketsActionInput } from '../dto/packets-action.input';

@Resolver(() => Packet)
export class PacketsResolver {
  constructor(
    private applicationsService: ApplicationsService,
    private studentsService: StudentsService,
    private schoolYearService: SchoolYearService,
    private studentApplicationsService: StudentApplicationsService,
    private packetsService: PacketsService,
    private enrollmentsService: EnrollmentsService,
    private packetFilesService: PacketFilesService,
    private immunizationSettingsService: ImmunizationSettingsService,
    private fileService: FilesService,
    private emailService: EmailsService,
    private packetEmailsService: PacketEmailsService,
  ) {}

  @Query(() => PacketPagination, { name: 'packets' })
  //@UseGuards(new AuthGuard())
  async getPackets(@Args() packetsArgs: PacketsArgs): Promise<Pagination<Packet>> {
    return this.packetsService.findAll(packetsArgs);
  }

  @Query(() => Packet, { name: 'packet' })
  @UseGuards(new AuthGuard())
  async getPacket(@Args({ name: 'packet_id', type: () => ID }) packet_id: number): Promise<Packet> {
    return this.packetsService.findOneById(packet_id);
  }

  @Query(() => FileData, { name: 'packetFiles' })
  async getPacketFiles(@Args({ name: 'file_ids', type: () => String }) file_ids: string): Promise<Pagination<File>> {
    return this.fileService.findByIds(file_ids);
  }

  @Query(() => File, { name: 'signatureFile' })
  async getGetSignatureFile(@Args({ name: 'file_id', type: () => ID }) file_id: number): Promise<File> {
    // return this.packetFilesService.getSignatureFile(file_id);
    return this.fileService.findOneById(file_id);
  }

  @Query(() => ImmunizationSettingsData, {
    name: 'immunizationSettings',
  })
  async getImmunizationSettings(
    @Args('where', { nullable: true }) where: FindImmunizationSettingsInput,
  ): Promise<Pagination<ImmunizationSettings>> {
    return this.immunizationSettingsService.findAll(where);
  }

  @Query(() => ResponseDTO, { name: 'packetStatuses' })
  @UseGuards(new AuthGuard())
  async getPacketStatues(): Promise<ResponseDTO> {
    return this.packetsService.getPacketStatues();
  }

  @Mutation(() => EnrollmentPacket, {
    name: 'saveEnrollmentPacketContact',
  })
  //@UseGuards(new AuthGuard())
  async saveEnrollmentContact(
    //@Context('user') user: User,
    @Args('enrollmentPacketContactInput')
    enrollmentPacketContactInput: EnrollmentPacketContactInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.saveContacts(enrollmentPacketContactInput);
  }

  @Mutation(() => EnrollmentPacket, {
    name: 'saveEnrollmentPacketSubmit',
  })
  //@UseGuards(new AuthGuard())
  async saveEnrollmentPacketSubmit(
    //@Context('user') user: User,
    @Args('enrollmentPacketContactInput')
    enrollmentPacketContactInput: EnrollmentPacketSubmitInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.submitEnrollment(enrollmentPacketContactInput);
  }

  @Mutation(() => EnrollmentPacket, { name: 'saveEnrollmentPacket' })
  async saveEnrollmentPacket(
    @Args('enrollmentPacketInput') enrollmentPacketInput: EnrollmentPacketInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.saveEnrollmentPacket(enrollmentPacketInput);
  }

  @Mutation(() => ResponseDTO, { name: 'sendEmail' })
  async sendEmail(@Args('emailInput') emailInput: EmailInput): Promise<ResponseDTO> {
    const { content, subject } = emailInput;
    const webAppUrl = process.env.WEB_APP_URL;
    const body = content.toString().replace(/\[HOST\]/g, webAppUrl);
    const emailSubject = subject.toString().replace(/\[HOST\]/g, webAppUrl);
    delete emailInput.content;
    delete emailInput.subject;
    const emailData = {
      ...emailInput,
      content: body,
      subject: emailSubject,
    };
    return await this.emailService.sendEmail(emailData);
  }

  @Mutation(() => EnrollmentPacket, {
    name: 'saveEnrollmentPacketPersonal',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentPersonal(
    @Context('user') user: User,
    @Args('enrollmentPacketPersonalInput')
    enrollmentPacketPersonalInput: EnrollmentPacketPersonalInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.savePersoanl(enrollmentPacketPersonalInput);
  }

  @Mutation(() => EnrollmentPacket, {
    name: 'saveEnrollmentPacketEducation',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentEducation(
    @Context('user') user: User,
    @Args('enrollmentPacketEducationInput')
    enrollmentPacketEducationInput: EnrollmentPacketEducationInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.saveEducation(enrollmentPacketEducationInput);
  }

  @Mutation(() => EnrollmentPacket, {
    name: 'saveEnrollmentPacketDocument',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentDocument(
    @Context('user') user: User,
    @Args('enrollmentPacketDocumentInput')
    enrollmentPacketDocumentInput: EnrollmentPacketDocumentInput,
  ): Promise<EnrollmentPacket | any> {
    return await this.enrollmentsService.saveDocument(enrollmentPacketDocumentInput);
  }

  @Mutation(() => EnrollmentPacket, {
    name: 'saveEnrollmentPacketSubmission',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentSubmission(
    @Context('user') user: User,
    @Args('enrollmentPacketDocumentInput')
    enrollmentPacketSubmissionInput: EnrollmentPacketSubmissionInput,
  ): Promise<EnrollmentPacket | any> {
    return await this.enrollmentsService.saveSubmission(enrollmentPacketSubmissionInput);
  }

  @ResolveField(() => Student, { name: 'student' })
  async getStudent(@Parent() packet: Packet): Promise<Student | any> {
    return (await this.studentsService.findOneById(packet.student_id)) || {};
  }

  @ResolveField(() => [PacketFile], { name: 'files' })
  async getFiles(@Parent() packet: Packet): Promise<PacketFile[]> {
    return await this.packetFilesService.findByPacket(packet.packet_id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; packet_id: number }): Promise<Packet> {
    return this.packetsService.findOneById(reference.packet_id);
  }

  @Mutation(() => [Packet], { name: 'deletePackets' })
  async deletePackets(
    @Args('packetsActionInput')
    packetsActionInput: PacketsActionInput,
  ): Promise<Packet[]> {
    return await this.packetsService.deletePackets(packetsActionInput);
  }

  @Mutation(() => ResponseDTO)
  deletePacketDocumentFile(@Args() input: DeleteFileArgs): Promise<ResponseDTO> {
    return this.fileService.deleteFile(input);
  }

  @ResolveField(() => [PacketEmail], { name: 'packet_emails' })
  public async getPacketEmails(@Parent() packet: Packet): Promise<PacketEmail[]> {
    return this.packetEmailsService.findByPacket(packet.packet_id);
  }

  @Mutation(() => [PacketEmail], { name: 'emailPacket' })
  @UseGuards(new AuthGuard())
  async emailPacket(
    @Context('user') user: User,
    @Args('emailApplicationInput') emailPacketInput: EmailApplicationInput,
  ): Promise<PacketEmail[]> {
    return await this.packetsService.sendEmail(emailPacketInput);
  }

  @Mutation(() => Boolean, { name: 'moveThisYearPacket' })
  async moveThisYearPacket(
    @Args('deleteApplicationInput')
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<boolean> {
    return await this.packetsService.moveThisYearPacket(deleteApplicationInput);
  }

  @Mutation(() => Boolean, { name: 'moveNextYearPacket' })
  async moveNextYearPacket(
    @Args('deleteApplicationInput')
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<boolean> {
    return await this.packetsService.moveNextYearPacket(deleteApplicationInput);
  }

  @Query(() => ResponseDTO, { name: 'packetCount' })
  @UseGuards(new AuthGuard())
  async getPacketCountGroup(): Promise<ResponseDTO> {
    return this.packetsService.getCountGroup();
  }

  @Query(() => ResponseDTO, { name: 'packetCountByRegionId' })
  @UseGuards(new AuthGuard())
  async getPacketCountByRegionId(@Args({ name: 'region_id', type: () => ID }) region_id: number): Promise<ResponseDTO> {
    return this.packetsService.getPacketCountByRegionId(region_id);
  }

  @Mutation(() => Boolean, { name: 'updateEnrollmentSchoolYearByIds' })
  async updateEnrollmentSchoolYearByIds(
    @Args('updateEnrollmentSchoolYearByIdsInput')
    updateEnrollmentSchoolYearByIdsInput: UpdateSchoolYearIdsInput,
  ): Promise<boolean> {
    return await this.packetsService.updateEnrollmentSchoolYearByIdsInput(updateEnrollmentSchoolYearByIdsInput);
  }

  @Mutation(() => Boolean, { name: 'generateStudentPacketPDF' })
  //@UseGuards(new AuthGuard())
  async generateStudentPacketPDF(
    @Args('generatePacketPdfInput')
    generatePacketPdfInput: StudentPacketPDFInput,
  ): Promise<boolean> {
    return this.packetsService.generateStudentPacketPDF(generatePacketPdfInput);
  }
}
