import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Avatar } from './avatar.entity';
import { Status } from 'src/other/enums/status.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true, length: 20 })
  username: string;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @OneToOne(() => Avatar, (avatar) => avatar.user)
  avatar: Avatar;

  @Column('boolean', { default: false })
  profileCompleted: boolean;

  @Column({ default: 100 })
  ranking: number;

  @Column('int', { default: [], array: true })
  followed: number[];

  @Column('int', { default: [], array: true })
  blocked: number[];

  @Column('int', { default: Status.OFFLINE })
  status: Status;
}
