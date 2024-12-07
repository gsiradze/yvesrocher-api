import { DataSource } from 'typeorm';

import typeormConfig from '../config/typeorm.config';

const typeOrmOptions = typeormConfig();

export const AppDataSource = new DataSource(typeOrmOptions);
