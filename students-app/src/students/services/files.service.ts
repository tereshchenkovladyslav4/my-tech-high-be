import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findByIds(file_ids: String): Promise<Pagination<File>> {
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
}
