import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate';
import { Repository } from 'typeorm';
import { CreateFileInput } from '../dto/new-file.inputs';
import { ResponseDTO } from '../dto/response.dto';
import { DeleteFileArgs } from '../models/file-data.entity';
import { File } from '../models/file.entity';
import { PacketFile } from '../models/packet-file.entity';
import { S3Service } from './s3.service';
@Injectable()
export class FilesService {
  constructor(
    private readonly s3Service: S3Service,

    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,

    @InjectRepository(PacketFile)
    private readonly packetFileRepository: Repository<PacketFile>,
  ) {}

  async findByIds(file_ids: string): Promise<Pagination<File>> {
    const qb = this.filesRepository.createQueryBuilder('file');
    const [results, total] = await qb
      .where('file.file_id IN (:...file_ids)', {
        file_ids: file_ids.split(',').map(String),
      })
      .orderBy('file.file_id', 'ASC')
      .getManyAndCount();
    const files = [];
    for (const file of results) {
      if (file.item1) {
        file.signedUrl = await this.s3Service.getObjectSignedUrl(file.item1);
      }
      files.push(file);
    }

    return new Pagination<File>({
      results: files,
      total,
    });
  }

  async findOneById(file_id: number): Promise<File> {
    const file = await this.filesRepository.findOne(file_id);
    file.signedUrl = await this.s3Service.getObjectSignedUrl(file.item1);
    return file;
  }

  async deleteFile(data: DeleteFileArgs): Promise<ResponseDTO> {
    const { fileId } = data;
    const attachmentId = (await this.filesRepository.findOne(fileId)).item1;
    await this.packetFileRepository.delete({
      mth_file_id: parseInt(fileId),
    });

    await this.filesRepository.delete({
      file_id: parseInt(fileId),
    });

    this.s3Service.deleteFile(attachmentId);

    return <ResponseDTO>{
      error: false,
      message: 'Deleted Successfully',
    };
  }
  async deleteFileByPath(path: string): Promise<ResponseDTO> {
    const attachmentId = path.includes('http') ? path.split('/').slice(3).join('/') : path;
    const fileId = (await this.filesRepository.findOne({ where: { item1: attachmentId } })).file_id;
    await this.packetFileRepository.delete({
      mth_file_id: fileId,
    });

    await this.filesRepository.delete({
      file_id: fileId,
    });

    this.s3Service.deleteFile(attachmentId);

    return <ResponseDTO>{
      error: false,
      message: 'Deleted Successfully',
    };
  }

  async create(file: CreateFileInput): Promise<File> {
    return this.filesRepository.save(file);
  }

  async upload(buffer: Buffer, directory: string, name: string, mimetype: string, year): Promise<File> {
    try {
      const extension = mimetype.split('/').pop();
      const upload = await this.s3Service.s3_upload(buffer, null, `${directory}/${name}.${extension}`, mimetype);

      const result = await this.create({
        name: name,
        type: mimetype,
        item1: upload.Key,
        item2: upload.ServerSideEncryption,
        item3: upload.ETag,
        year: year,
      });
      return result;
    } catch (err) {
      return null;
    }
  }
}
