import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VerificationHistory } from './verification-history.entity';
import { VerificationStatus } from './verification-status.enum';

export { VerificationStatus };

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

  // There is no public, unified German Handwerkskammer registry API to
  // check hwkNumber against automatically, so a human must confirm it
  // against the regional chamber's own register before a verification
  // with an hwkNumber can be approved. See VerificationService.
  @Column({ default: false })
  hwkManuallyVerified: boolean;

  @Column({ nullable: true })
  hwkVerifiedBy?: string;

  @Column({ nullable: true })
  hwkVerifiedAt?: Date;

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
