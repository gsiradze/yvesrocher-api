import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733575544235 implements MigrationInterface {
  name = 'Migration1733575544235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthDate" date NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "newsLetters" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
