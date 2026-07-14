import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Tracks the last issued invoice number per year so numbers stay
 * sequential and gapless, as required by §14 UStG. Rows are locked
 * with SELECT ... FOR UPDATE when a number is issued (see
 * InvoicesService.generateInvoiceNumber) so concurrent invoice
 * creation can't produce duplicates or skip numbers.
 */
@Entity()
export class InvoiceSequence {
  @PrimaryColumn({ type: 'int' })
  year: number;

  @Column({ type: 'int', default: 0 })
  lastNumber: number;
}
