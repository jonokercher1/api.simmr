import 'reflect-metadata';
import { container } from 'tsyringe';
import UserRepository from './src/infrastructure/database/repositories/UserRepository';

beforeAll(async () => {
  console.log('Migrating test database...');

  container.register('UserRepository', { useClass: UserRepository });

  console.log('Migrations completed.');
});
