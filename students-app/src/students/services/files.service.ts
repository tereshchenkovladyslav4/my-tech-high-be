import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileInput } from '../dto/new-file.inputs';
import { File } from '../models/file.entity';
import { Pagination } from '../paginate';
import { S3Service } from './s3.service';
@Injectable()
export class FilesService {
  constructor(
    private readonly s3Service: S3Service,

    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async create(file: CreateFileInput): Promise<File> {
    return this.filesRepository.save(file);
  }

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
