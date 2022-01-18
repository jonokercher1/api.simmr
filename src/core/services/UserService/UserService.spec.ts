import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';
import bcrypt from 'bcrypt';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import UserService from './UserService';
import { IRegisterData } from '../../../http/requests/RegisterRequest';
import UserExistsException from '../../exceptions/database/UserExistsException';
import IUserRepository from '../../contracts/infrastructure/database/IUserRepository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockProxy<IUserRepository>;

  beforeAll(async () => {
    userRepository = mock<IUserRepository>({
      insert: jest.fn().mockResolvedValue([{
        id: faker.datatype.number(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await bcrypt.hash(faker.internet.password(12), 10),
      }]),
    });
    userService = new UserService(userRepository);
  });

  describe('createUser', () => {
    it('should return the new user', async () => {
      const userData: IRegisterData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
      };

      userRepository.insertOne.mockResolvedValueOnce(userData);

      const response = await userService.createUser(userData);

      expect(response.firstName).toEqual(userData.firstName);
      expect(response.lastName).toEqual(userData.lastName);
      expect(response.email).toEqual(userData.email);
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
      } catch (e: any) {
        expect(e).toBeInstanceOf(UserExistsException);
        expect(e.message).toEqual('User with that email already exists');
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

      userRepository.insertOne.mockResolvedValueOnce(userData);

      const user = await userRepository.insertOne<Partial<IDbUser>, IDbUser>(userData);

      const newFirstName = faker.name.firstName();

      userRepository.update.mockResolvedValueOnce({
        ...userData,
        firstName: newFirstName,
      });

      const response = await userService.updateUser(user, { firstName: newFirstName });

      expect(response.id).toEqual(user.id);
      expect(response.email).toEqual(userData.email);
      expect(response.firstName).not.toEqual(userData.firstName);
      expect(response.firstName).toEqual(newFirstName);
    });

    it('should throw a useful error if the email is used by another user', async () => {
      const existingUserData: IDbUser = {
        id: faker.datatype.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
      };

      userRepository.findByEmailExcludingIds.mockResolvedValueOnce(existingUserData);

      const userToUpdate: IDbUser = {
        id: faker.datatype.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.datatype.string(12),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
      };

      try {
        await userService.updateUser(userToUpdate, { email: existingUserData.email });
      } catch (e: any) {
        expect(e.message).toEqual('User with that email already exists');
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

      userRepository.insertOne.mockResolvedValueOnce(userData);

      const user = await userRepository.insertOne<Partial<IDbUser>, IDbUser>(userData);

      userRepository.update.mockResolvedValueOnce(userData);

      const response = await userService.updateUser(user, { email: user.email });

      expect(response.id).toEqual(user.id);
      expect(response.email).toEqual(userData.email);
    });
  });
});
