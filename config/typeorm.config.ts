import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions & DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'yvesrocher-db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [join(__dirname, '/../**/migrations/*.{ts,js}')],
  synchronize: false,
  autoLoadEntities: true,
  logging: true,
});
