import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const typeOrmOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'yvesrocher-db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
  logging: true,
};

export default registerAs('typeorm', () => {
  return {
    ...typeOrmOptions,
    migrations: [join(__dirname, '../**/migrations/*.{ts,js}')],
  };
});
