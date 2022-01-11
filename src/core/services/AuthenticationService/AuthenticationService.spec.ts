import { JsonWebTokenError } from 'jsonwebtoken';
import { mock, MockProxy } from 'jest-mock-extended';
import faker from 'faker';
import bcrypt from 'bcrypt';
import AuthenticationService from './AuthenticationService';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import IUserRepository from '../../contracts/infrastructure/database/IUserRepository';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userTestUtils: UserTestUtils;
  let mockUserRepository: MockProxy<IUserRepository>;

  beforeAll(async () => {
    mockUserRepository = mock<IUserRepository>({
      insert: jest.fn().mockResolvedValue([{
        id: faker.datatype.number(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await bcrypt.hash(faker.internet.password(12), 10),
      }]),
    });

    authenticationService = new AuthenticationService(mockUserRepository);
    userTestUtils = new UserTestUtils(mockUserRepository);
  });

  beforeEach(() => {
    userTestUtils.clearUsers();
  });

  describe('generateToken', () => {
    it('should generate a token for a user', async () => {
      const userId = 1;
      const token = await authenticationService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('validateToken', () => {
    it('should return a user from a valid token', async () => {
      const user = await userTestUtils.createUser();

      mockUserRepository.findOne.mockResolvedValue(user);

      const token = await TokenTestUtils.generateToken(user.id.toString());
      const tokenData = await authenticationService.getUserFromToken(token);

      expect(tokenData.id).toEqual(user.id);
    });

    it('should throw an error if the token has been tampered with', async () => {
      try {
        const token = await TokenTestUtils.generateToken('1');
        await authenticationService.getUserFromToken(`${token}_tampered`);
      } catch (e: any) {
        expect(e).toBeInstanceOf(JsonWebTokenError);
        expect(e.message).toEqual('invalid signature');
      }
    });
  });

  describe('verifyCredentials', () => {
    it('should return the user from a valid combination', async () => {
      const password = 'password';

      mockUserRepository.insert.mockResolvedValueOnce([{
        id: faker.datatype.number(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await bcrypt.hash(password, 10),
      }]);

      const user = await userTestUtils.createUser({ password });

      mockUserRepository.findOne.mockResolvedValue(user);

      const userFromCredentials = await authenticationService.verifyCredentials(user.email, password);

      expect(userFromCredentials.id).toEqual(user.id);
      expect(userFromCredentials.email).toEqual(user.email);
    });

    it('should error if no user with specified email', async () => {
      try {
        await authenticationService.verifyCredentials('invalidemail', 'password');
      } catch (e) {
        expect((e as any).message).toEqual('User not found');
      }
    });

    it('should error with valid email and invalid password', async () => {
      const user = await userTestUtils.createUser();

      try {
        await authenticationService.verifyCredentials(user.email, 'invalidpassword');
      } catch (e) {
        expect((e as any).message).toEqual('Invalid Credentials');
      }
    });
  });
});
