import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VerificationHistory } from './verification-history.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity()
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  providerId: string;

  @Column({ nullable: true })
  meisterbriefUrl?: string;

  @Column({ nullable: true })
  idCardUrl?: string;

  @Column({ nullable: true })
  insuranceUrl?: string;

  @Column({ nullable: true })
  insuranceExpiry?: Date;

  @Column({ nullable: true })
  hwkNumber?: string;

  @Column({ nullable: true })
  iban?: string;

  @Column({ nullable: true })
  bankStatementUrl?: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  nextReverificationDate?: Date;

  @OneToMany(() => VerificationHistory, (history) => history.verification)
  history: VerificationHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
