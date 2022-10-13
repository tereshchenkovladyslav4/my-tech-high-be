import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, InsertResult } from 'typeorm';
import { File } from '../models/file.entity';
import { PacketFile } from '../models/packet-file.entity';
import { S3Service } from './s3.service';
import { DocumentItemInput } from '../dto/document-item.inputs';
@Injectable()
export class PacketFilesService {
  constructor(
    private readonly s3Service: S3Service,

    @InjectRepository(PacketFile)
    private readonly packetFilesRepository: Repository<PacketFile>,
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async findOneById(file_id: number): Promise<PacketFile> {
    return this.packetFilesRepository.findOne(file_id);
  }

  async getSignatureFile(file_id: number): Promise<File> {
    const packetFile = await this.packetFilesRepository.findOne(file_id);
    if (!packetFile) return null;
    const file = await this.filesRepository.findOne(packetFile.mth_file_id);
    file.signedUrl = await this.s3Service.getObjectSignedUrl(file.item1);
    return file;
  }

  async findByPacket(packet_id: number): Promise<PacketFile[]> {
    return this.packetFilesRepository.find({
      where: {
        packet_id: packet_id,
      },
    });
  }

  async createMany(packet_id: number, documents: DocumentItemInput[]): Promise<any> {
    const files = [];
    documents.map((item, i) => {
      files.push({
        packet_id,
        mth_file_id: item.mth_file_id,
        kind: item.kind,
      });
    });

    return await getConnection().createQueryBuilder().insert().into(PacketFile).values(files).orIgnore().execute();
  }
}
