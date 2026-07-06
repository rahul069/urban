import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { Provider } from '../providers/providers.entity';
import { Payment } from '../payments/payment.entity';

export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
@Index(['providerId', 'status'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  providerId: string;

  @ManyToOne(() => Provider)
  provider: Provider;

  @OneToMany(() => Payment, payment => payment.booking)
  payments: Payment[];

  @Column()
  serviceType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount?: number;

  @Column({ type: 'text', nullable: true })
  customerAddress?: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude?: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
