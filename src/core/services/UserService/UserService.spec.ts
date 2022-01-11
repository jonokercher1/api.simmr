import faker from 'faker';
import MockUserRepository from '../../../../__test__/mocks/repository/MockUserRepository';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import UserService from './UserService';
import { IRegisterData } from '../../../http/requests/RegisterRequest';
import UserExistsException from '../../exceptions/database/UserExistsException';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockUserRepository;

  beforeAll(() => {
    userRepository = new MockUserRepository();
    userService = new UserService(userRepository);
  });

  describe('createUser', () => {
    it('should insert a new user', async () => {
      const userData: IRegisterData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
      };

      const response = await userService.createUser(userData);

      expect(response.firstName).toEqual(userData.firstName);
      expect(response.lastName).toEqual(userData.lastName);
      expect(response.email).toEqual(userData.email);

      const dbRecord = await userRepository.findOne<IDbUser>({ email: userData.email });

      expect(dbRecord.firstName).toEqual(userData.firstName);
      expect(dbRecord.lastName).toEqual(userData.lastName);
      expect(dbRecord.email).toEqual(userData.email);
    });

    it('should throw a useful error if the email is used by another user', async () => {
      const email = faker.internet.email();

      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password: faker.datatype.string(12),
      };

      await userRepository.insertOne(userData);

      try {
        await userService.createUser(userData);
      } catch (e) {
        expect(e).toBeInstanceOf(UserExistsException);
        expect((e as any).message).toEqual('User with that email already exists');
      }
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
      };

      const user = await userRepository.insertOne<Partial<IDbUser>, IDbUser>(userData);

      const newFirstName = faker.name.firstName();

      const response = await userService.updateUser(user, { firstName: newFirstName });

      expect(response.id).toEqual(user.id);
      expect(response.email).toEqual(userData.email);
      expect(response.firstName).not.toEqual(userData.firstName);
      expect(response.firstName).toEqual(newFirstName);
    });

    it('should throw a useful error if the email is used by another user', async () => {
      const existingUser = await userRepository.insertOne<Partial<IDbUser>, IDbUser>({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
      });

      const userToUpdate = await userRepository.insertOne<Partial<IDbUser>, IDbUser>({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
      });

      try {
        await userService.updateUser(userToUpdate, { email: existingUser.email });
      } catch (e) {
        expect((e as any).message).toEqual('User with that email already exists');
        expect(e).toBeInstanceOf(UserExistsException);
      }
    });

    it('should not error if the user tries to update their email to the one they currently have set', async () => {
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
      };

      const user = await userRepository.insertOne<Partial<IDbUser>, IDbUser>(userData);

      const response = await userService.updateUser(user, { email: user.email });

      expect(response.id).toEqual(user.id);
      expect(response.email).toEqual(userData.email);
    });
  });
});
