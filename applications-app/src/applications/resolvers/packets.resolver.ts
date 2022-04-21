import {
  Args,
  ID,
  Query,
  Resolver,
  ResolveReference,
  Mutation,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { User } from '../models/user.entity';
import { SchoolYear } from '../models/schoolyear.entity';
import { Application } from '../models/application.entity';
import { StudentsService } from '../services/students.service';
import { ApplicationsService } from '../services/applications.service';
import { SchoolYearService } from '../services/schoolyear.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApplicationsArgs } from '../dto/applications.args';
import { CreateStudentApplicationInput } from '../dto/new-student-application.inputs';
import { ParentApplication } from '../models/parent-application.entity';
import { CreateApplicationInput } from '../dto/new-application.inputs';
import { ApplicationsService as StudentApplicationsService } from '../applications.service';
import { CreateParentStudentInput } from '../dto/new-parent-student.inputs';
import { Packet } from '../models/packet.entity';
import { PacketsService } from '../services/packets.service';
import { EnrollmentPacketContactInput } from '../dto/enrollment-packet-contact.inputs';
import { EnrollmentPacketPersonalInput } from '../dto/enrollment-packet-personal.inputs';
import { PacketsArgs, DeletePacketArgs } from '../dto/packets.args';
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
import { FindImunizationSettingsInput } from '../dto/find-immunization';

@Resolver((of) => Packet)
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
  ) {}

  @Query((returns) => PacketPagination, { name: 'packets' })
  //@UseGuards(new AuthGuard())
  async getPackets(
    @Args() packetsArgs: PacketsArgs,
  ): Promise<Pagination<Packet>> {
    return this.packetsService.findAll(packetsArgs);
  }

  @Query((returns) => Packet, { name: 'packet' })
  @UseGuards(new AuthGuard())
  async getPacket(
    @Args({ name: 'packet_id', type: () => ID }) packet_id: number,
  ): Promise<Packet> {
    return this.packetsService.findOneById(packet_id);
  }

  @Query((returns) => FileData, { name: 'packetFiles' })
  async getPacketfiles(
    @Args({ name: 'file_ids', type: () => String }) file_ids: String,
  ): Promise<Pagination<File>> {
    return this.fileService.findByIds(file_ids);
  }

  @Query((returns) => File, { name: 'signatureFile' })
  async getGetSignatureFile(
    @Args({ name: 'file_id', type: () => ID }) file_id: number,
  ): Promise<File> {
    // return this.packetFilesService.getSignatureFile(file_id);
    return this.fileService.findOneById(file_id);
  }

  @Query((returns) => ImmunizationSettingsData, {
    name: 'immunizationSettings',
  })
  async getImmunizationSettings(
    @Args('where', { nullable: true }) where: FindImunizationSettingsInput,
  ): Promise<Pagination<ImmunizationSettings>> {
    return this.immunizationSettingsService.findAll(where);
  }

  @Query((returns) => ResponseDTO, { name: 'packetStatuses' })
  @UseGuards(new AuthGuard())
  async getPacketStatues(): Promise<ResponseDTO> {
    return this.packetsService.getPacketStatues();
  }

  @Mutation((returns) => EnrollmentPacket, {
    name: 'saveEnrollmentPacketContact',
  })
  //@UseGuards(new AuthGuard())
  async saveEnrollmentContact(
    //@Context('user') user: User,
    @Args('enrollmentPacketContactInput')
    enrollmentPacketContactInput: EnrollmentPacketContactInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.saveContacts(
      enrollmentPacketContactInput,
    );
  }

  @Mutation((returns) => EnrollmentPacket, { name: 'saveEnrollmentPacket' })
  async saveEnrollmentPacket(
    @Args('enrollmentPacketInput') enrollmentPacketInput: EnrollmentPacketInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.saveEnrollmentPacket(
      enrollmentPacketInput,
    );
  }

  @Mutation((returns) => ResponseDTO, { name: 'sendEmail' })
  async sendEmail(
    @Args('emailInput') emailInput: EmailInput,
  ): Promise<ResponseDTO> {
    return await this.emailService.sendEmail(emailInput);
  }

  @Mutation((returns) => EnrollmentPacket, {
    name: 'saveEnrollmentPacketPersonal',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentPersonal(
    @Context('user') user: User,
    @Args('enrollmentPacketPersonalInput')
    enrollmentPacketPersonalInput: EnrollmentPacketPersonalInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.savePersoanl(
      enrollmentPacketPersonalInput,
    );
  }

  @Mutation((returns) => EnrollmentPacket, {
    name: 'saveEnrollmentPacketEducation',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentEducation(
    @Context('user') user: User,
    @Args('enrollmentPacketEducationInput')
    enrollmentPacketEducationInput: EnrollmentPacketEducationInput,
  ): Promise<EnrollmentPacket> {
    return await this.enrollmentsService.saveEducation(
      enrollmentPacketEducationInput,
    );
  }

  @Mutation((returns) => EnrollmentPacket, {
    name: 'saveEnrollmentPacketDocument',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentDocument(
    @Context('user') user: User,
    @Args('enrollmentPacketDocumentInput')
    enrollmentPacketDocumentInput: EnrollmentPacketDocumentInput,
  ): Promise<EnrollmentPacket | any> {
    return await this.enrollmentsService.saveDocument(
      enrollmentPacketDocumentInput,
    );
  }

  @Mutation((returns) => EnrollmentPacket, {
    name: 'saveEnrollmentPacketSubmission',
  })
  @UseGuards(new AuthGuard())
  async saveEnrollmentSubmission(
    @Context('user') user: User,
    @Args('enrollmentPacketDocumentInput')
    enrollmentPacketSubmissionInput: EnrollmentPacketSubmissionInput,
  ): Promise<EnrollmentPacket | any> {
    return await this.enrollmentsService.saveSubmission(
      enrollmentPacketSubmissionInput,
    );
  }

  @ResolveField((of) => Student, { name: 'student' })
  async getStudent(@Parent() packet: Packet): Promise<Student | any> {
    return (await this.studentsService.findOneById(packet.student_id)) || {};
  }

  @ResolveField((of) => [PacketFile], { name: 'files' })
  async getFiles(@Parent() packet: Packet): Promise<PacketFile[]> {
    return await this.packetFilesService.findByPacket(packet.packet_id);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    packet_id: number;
  }): Promise<Packet> {
    return this.packetsService.findOneById(reference.packet_id);
  }

  // @Mutation((returns) => ResponseDTO)
  // @UseGuards(new AuthGuard())
  // deletePacket(
  //   @Args() input: DeletePacketArgs,
  //   @Context('user') user: User,
  // ): Promise<ResponseDTO> {
  //   return this.packetsService.deletePacket(input, user);
  // }

  @Mutation((returns) => [Packet], { name: 'deletePacket' })
  async deletePacket(
    @Args('deleteApplicationInput')
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Packet[]> {
    return await this.packetsService.deletePacket(deleteApplicationInput);
  }

  @Mutation((returns) => ResponseDTO)
  deletePacketDocumentFile(
    @Args() input: DeleteFileArgs,
  ): Promise<ResponseDTO> {
    return this.fileService.deleteFile(input);
  }

  @Mutation((returns) => [Packet], { name: 'emailPacket' })
  @UseGuards(new AuthGuard())
  async emailPacket(
    @Context('user') user: User,
    @Args('emailApplicationInput') emailPacketInput: EmailApplicationInput,
  ): Promise<Packet[]> {
    return await this.packetsService.sendEmail(emailPacketInput);
  }

  @Mutation((returns) => Boolean, { name: 'moveThisYearPacket' })
  async moveThisYearPacket(
    @Args('deleteApplicationInput')
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
    return await this.packetsService.moveThisYearPacket(deleteApplicationInput);
  }

  @Mutation((returns) => Boolean, { name: 'moveNextYearPacket' })
  async moveNextYearPacket(
    @Args('deleteApplicationInput')
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
    return await this.packetsService.moveNextYearPacket(deleteApplicationInput);
  }

  @Query((returns) => ResponseDTO, { name: 'packetCount' })
  @UseGuards(new AuthGuard())
  async getpacketCountGroup(): Promise<ResponseDTO> {
    return this.packetsService.getCountGroup();
  }
}
