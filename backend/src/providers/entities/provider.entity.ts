import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  verificationDocuments?: any;

  @Column({ type: 'jsonb', nullable: true })
  servicesOffered?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}