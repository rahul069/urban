import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Verification } from './verification.entity';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ nullable: true })
  tradeLicenseNumber?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @OneToOne(() => Verification, { cascade: true })
  @JoinColumn()
  verification: Verification;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
