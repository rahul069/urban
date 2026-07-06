import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Verification, VerificationStatus } from './verification.entity';

@Entity()
export class VerificationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  verificationId: string;

  @ManyToOne(() => Verification, (verification) => verification.history)
  verification: Verification;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    enumName: 'verification_status_enum'
  })
  status: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  changedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}