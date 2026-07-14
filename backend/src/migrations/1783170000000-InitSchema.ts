import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Baseline schema for tables that previously existed only via
 * `synchronize: true`. Generated from the actual entity definitions
 * against a real Postgres+PostGIS instance so it matches runtime schema
 * exactly. Does not touch `payment`, which already has its own migration.
 */
export class InitSchema1783170000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."verification_status_enum" AS ENUM (
        'pending', 'approved', 'rejected', 'expired', 'anonymized'
      );
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."verification_history_status_enum" AS ENUM (
        'pending', 'approved', 'rejected', 'expired', 'anonymized'
      );
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."booking_status_enum" AS ENUM (
        'pending', 'accepted', 'declined', 'in_progress', 'completed', 'cancelled'
      );
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."invoice_status_enum" AS ENUM (
        'draft', 'sent', 'paid', 'overdue', 'cancelled'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "verification" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "providerId" character varying NOT NULL,
        "meisterbriefUrl" character varying,
        "idCardUrl" character varying,
        "insuranceUrl" character varying,
        "insuranceExpiry" TIMESTAMP,
        "hwkNumber" character varying,
        "hwkManuallyVerified" boolean NOT NULL DEFAULT false,
        "hwkVerifiedBy" character varying,
        "hwkVerifiedAt" TIMESTAMP,
        "iban" character varying,
        "bankStatementUrl" character varying,
        "status" "public"."verification_status_enum" NOT NULL DEFAULT 'pending',
        "rejectionReason" text,
        "nextReverificationDate" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_verification_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "provider" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "isVerified" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" character varying NOT NULL,
        "address" character varying,
        "city" character varying,
        "postalCode" character varying,
        "taxId" character varying,
        "tradeLicenseNumber" character varying,
        "hourlyRate" numeric(10,2),
        "bio" text,
        "profileImageUrl" character varying,
        "verificationId" uuid,
        "profilePicture" character varying,
        "verificationDocuments" jsonb,
        "servicesOffered" jsonb,
        CONSTRAINT "UQ_provider_email" UNIQUE ("email"),
        CONSTRAINT "UQ_provider_verificationId" UNIQUE ("verificationId"),
        CONSTRAINT "PK_provider_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      ALTER TABLE "provider"
      ADD CONSTRAINT "FK_provider_verificationId"
      FOREIGN KEY ("verificationId") REFERENCES "verification"("id");
    `);

    await queryRunner.query(`
      CREATE TABLE "customer" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "userId" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phoneNumber" character varying,
        "address" character varying,
        "city" character varying,
        "postalCode" character varying,
        "stripeCustomerId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customer_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "booking" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "customerId" character varying NOT NULL,
        "providerId" uuid NOT NULL,
        "serviceType" character varying NOT NULL,
        "description" text NOT NULL,
        "scheduledAt" TIMESTAMP NOT NULL,
        "estimatedPrice" numeric(10,2),
        "finalPrice" numeric(10,2),
        "totalAmount" numeric(10,2),
        "customerAddress" text,
        "latitude" numeric(10,6),
        "longitude" numeric(10,6),
        "status" "public"."booking_status_enum" NOT NULL DEFAULT 'pending',
        "cancellationReason" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_booking_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      ALTER TABLE "booking"
      ADD CONSTRAINT "FK_booking_providerId"
      FOREIGN KEY ("providerId") REFERENCES "provider"("id");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_booking_providerId_status" ON "booking" ("providerId", "status");
    `);

    await queryRunner.query(`
      CREATE TABLE "invoice" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "bookingId" uuid NOT NULL,
        "providerId" uuid NOT NULL,
        "customerId" uuid NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "taxAmount" numeric(10,2),
        "taxRate" numeric(4,2) NOT NULL DEFAULT 19.00,
        "discountAmount" numeric(10,2),
        "totalAmount" numeric(10,2) NOT NULL,
        "description" text,
        "invoiceNumber" text,
        "issueDate" TIMESTAMP,
        "dueDate" TIMESTAMP,
        "status" "public"."invoice_status_enum" NOT NULL DEFAULT 'draft',
        "pdfUrl" text,
        "xmlUrl" text,
        "paymentTerms" text,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_invoice_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice"
      ADD CONSTRAINT "FK_invoice_bookingId" FOREIGN KEY ("bookingId") REFERENCES "booking"("id");
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice"
      ADD CONSTRAINT "FK_invoice_providerId" FOREIGN KEY ("providerId") REFERENCES "provider"("id");
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice"
      ADD CONSTRAINT "FK_invoice_customerId" FOREIGN KEY ("customerId") REFERENCES "customer"("id");
    `);

    await queryRunner.query(`
      CREATE TABLE "verification_history" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "verificationId" uuid NOT NULL,
        "status" "public"."verification_history_status_enum" NOT NULL,
        "notes" text,
        "changedBy" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_verification_history_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      ALTER TABLE "verification_history"
      ADD CONSTRAINT "FK_verification_history_verificationId"
      FOREIGN KEY ("verificationId") REFERENCES "verification"("id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "verification_history";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoice";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "booking";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "customer";`);
    await queryRunner.query(`ALTER TABLE "provider" DROP CONSTRAINT IF EXISTS "FK_provider_verificationId";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "provider";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "verification";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."invoice_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."booking_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."verification_history_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."verification_status_enum";`);
  }
}
