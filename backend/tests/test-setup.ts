import { createConnection, getConnection } from 'typeorm';
import { User } from '../src/models/User';
import { Sweet } from '../src/models/Sweet';

beforeAll(async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User, Sweet],
    synchronize: true,
    logging: false
  });
});

afterAll(async () => {
  await getConnection().close();
});