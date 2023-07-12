import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Connection } from 'src/entities/connection.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>
  ) {}

  async getConnection(
    where: any,
    relations = [] as string[]
  ): Promise<Connection> {
    const connection: Connection = await this.connectionRepository.findOne({
      where,
      relations,
    });
    if (!connection)
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND);
    return connection;
  }

  async createConnection(userId: number): Promise<Connection> {
    let connection: Connection = await this.getConnection({
      user: userId,
    }).catch(() => null);
    if (connection)
      throw new HttpException('Connection already exists', HttpStatus.CONFLICT);
    connection = this.connectionRepository.create({
      user: { id: userId },
    });
    try {
      await this.connectionRepository.save(connection);
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
    return connection;
  }

  async updateConnection(connectionId: number, data: any): Promise<any> {
    try {
      await this.connectionRepository.update(connectionId, data);
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOTP(userId: number, secret: string): Promise<void> {
    const connection: Connection = await this.getConnection({ user: userId });
    try {
      await this.connectionRepository.update(connection.id, {
        OTP: secret,
      });
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
