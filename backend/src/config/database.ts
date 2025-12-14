import { ConnectionOptions } from 'typeorm';
import { User } from '../models/User';
import { Sweet } from '../models/Sweet';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sweet_shop_db',
  entities: [User, Sweet],
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
};

export default config;