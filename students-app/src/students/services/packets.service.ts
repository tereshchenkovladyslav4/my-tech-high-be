import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Packet } from '../models/packet.entity';

@Injectable()
export class PacketsService {
  constructor(
    @InjectRepository(Packet)
    private readonly packetsRepository: Repository<Packet>,
  ) {}

  async findByStudentAndStatus(student_id: number): Promise<Packet> {
    return this.packetsRepository.findOne({
      where: {
        student_id: student_id,
      },
    });
  }
}
