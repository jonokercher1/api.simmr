import 'reflect-metadata';
import TestDatabaseConnector from './__test__/mocks/database';

beforeAll(async () => {
  console.log('Migrating test database...');

  const database = new TestDatabaseConnector();
  await database.connection.migrate.latest({ directory: './src/infrastructure/database/migrations' });
  await database.disconnect();

  console.log('Migrations completed.');
});
