import MockRepository from './MockRepository';
import IUserRepository from '../../../src/core/contracts/infrastructure/database/IUserRepository';

export default class MockUserRepository extends MockRepository implements IUserRepository {}
