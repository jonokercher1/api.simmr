import AuthenticationService from './AuthenticationService';
import UserRepository from '../../../infrastructure/database/repositories/UserRepository';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TestDatabaseConnector from '../../../../__test__/mocks/database';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userTestUtils: UserTestUtils;

  beforeAll(() => {
    const userRepository = new UserRepository(new TestDatabaseConnector());
    authenticationService = new AuthenticationService(userRepository);
    userTestUtils = new UserTestUtils();
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
      try {
        const user = await userTestUtils.createUser();
        console.log('🚀 ~ file: AuthenticationService.spec.ts ~ line 31 ~ it ~ user', user);
      } catch (e) {
        console.log('🚀 ~ file: AuthenticationService.spec.ts ~ line 32 ~ it ~ e', e);
      }
      // console.log('🚀 ~ file: AuthenticationService.spec.ts ~ line 30 ~ it ~ user', user);
      // const token = await TokenTestUtils.generateToken(user.id);
      // const tokenData: any = await authenticationService.getUserFromToken(token);

      // expect(tokenData.id).toEqual(user.id);
    });
  });
});
