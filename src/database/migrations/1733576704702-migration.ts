import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733576704702 implements MigrationInterface {
  name = 'Migration1733576704702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "source" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "source"`);
  }
}
