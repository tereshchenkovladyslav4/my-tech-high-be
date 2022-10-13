import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileInput } from '../dto/new-file.inputs';
import { File } from '../models/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async create(file: CreateFileInput): Promise<File> {
    return this.filesRepository.save(file);
  }
}
