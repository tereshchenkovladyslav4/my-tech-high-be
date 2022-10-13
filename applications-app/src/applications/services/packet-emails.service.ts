import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePacketEmailInput } from '../dto/new-packet-email.inputs';
import { PacketEmail } from '../models/packet-email.entity';
@Injectable()
export class PacketEmailsService {
  constructor(
    @InjectRepository(PacketEmail)
    private readonly packetEmailsRepository: Repository<PacketEmail>,
  ) {}

  async findByPacket(packet_id: number): Promise<PacketEmail[]> {
    return this.packetEmailsRepository.find({ where: { packet_id: packet_id }, order: { created_at: 'ASC' } });
  }

  async findByOrder(): Promise<string> {
    return this.packetEmailsRepository
      .createQueryBuilder('packetEmail')
      .select()
      .orderBy('packetEmail.created_at', 'DESC')
      .addGroupBy('packetEmail.packet_id')
      .getQuery();
  }

  async create(packetEmail: CreatePacketEmailInput): Promise<PacketEmail> {
    return this.packetEmailsRepository.save(packetEmail);
  }
}
