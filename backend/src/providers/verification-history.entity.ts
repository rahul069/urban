import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Verification } from './verification.entity';
import { VerificationStatus } from './verification-status.enum';

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
  })
  status: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  changedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}