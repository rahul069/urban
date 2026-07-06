import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddPaymentEntity1783180973035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'payment',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'completed', 'failed', 'refunded'],
                    default: "'pending'",
                },
                {
                    name: 'paymentMethod',
                    type: 'enum',
                    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash'],
                },
                {
                    name: 'transactionId',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'invoiceUrl',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'stripePaymentIntentId',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'stripeCustomerId',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'bookingId',
                    type: 'uuid',
                },
                {
                    name: 'providerId',
                    type: 'uuid',
                },
                {
                    name: 'customerId',
                    type: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }), true);
        
        await queryRunner.createForeignKeys('payment', [
            new TableForeignKey({
                columnNames: ['bookingId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'booking',
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                columnNames: ['providerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'provider',
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                columnNames: ['customerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'customer',
                onDelete: 'CASCADE',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('payment');
        if (table) {
            await queryRunner.dropForeignKeys('payment', table.foreignKeys);
        }
        await queryRunner.dropTable('payment');
    }

}
