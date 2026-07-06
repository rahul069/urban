import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnablePostgis1783168781511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS postgis_topology;');
    await queryRunner.query('DROP EXTENSION IF EXISTS postgis;');
  }
}
