import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Backs sequential/gapless invoice numbering (§14 UStG). One row per
 * calendar year; InvoicesService.generateInvoiceNumber locks the row
 * with SELECT ... FOR UPDATE before incrementing it.
 */
export class AddInvoiceSequence1783200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "invoice_sequence" (
        "year" int NOT NULL,
        "lastNumber" int NOT NULL DEFAULT 0,
        CONSTRAINT "PK_invoice_sequence_year" PRIMARY KEY ("year")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "invoice_sequence";`);
  }
}
