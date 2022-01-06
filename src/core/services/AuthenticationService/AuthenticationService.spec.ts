import { JsonWebTokenError } from 'jsonwebtoken';
import AuthenticationService from './AuthenticationService';
import UserRepository from '../../../infrastructure/database/repositories/UserRepository';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TestDatabaseConnector from '../../../../__test__/mocks/database';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userTestUtils: UserTestUtils;
  const database = new TestDatabaseConnector();

  beforeAll(() => {
    const userRepository = new UserRepository(database);
    authenticationService = new AuthenticationService(userRepository);
    userTestUtils = new UserTestUtils();
  });

  afterAll(async () => {
    userTestUtils.database.disconnect();
    await database.disconnect();
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
      const user = await userTestUtils.createUser({ password });
      const userFromCredentials = await authenticationService.verifyCredentials(user.email, password);

      expect(userFromCredentials.id).toEqual(user.id);
      expect(userFromCredentials.email).toEqual(user.email);
    });

    it('should error if no user with specified email', async () => {
      try {
        await authenticationService.verifyCredentials('invalidemail', 'password');
      } catch (e) {
        expect((e as any).message).toEqual('Invalid credentials');
      }
    });

    it('should error with valid email and invalid password', async () => {
      const user = await userTestUtils.createUser();

      try {
        await authenticationService.verifyCredentials(user.email, 'invalidpassword');
      } catch (e) {
        expect((e as any).message).toEqual('Invalid credentials');
      }
    });
  });
});
