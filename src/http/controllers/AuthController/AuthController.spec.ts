import { createMockContext } from '@shopify/jest-koa-mocks';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import MockUserRepository from '../../../../__test__/mocks/repository/MockUserRepository';
import AuthController from './AuthController';
import Logger from '../../../infrastructure/logging/Logger';

describe('AuthController', () => {
  let authenticationService: AuthenticationService;
  let userTestUtils: UserTestUtils;
  let authController: AuthController;

  beforeAll(() => {
    const userRepository = new MockUserRepository();
    authenticationService = new AuthenticationService(userRepository);
    userTestUtils = new UserTestUtils(userRepository);
    authController = new AuthController(new Logger(), authenticationService);
  });

  describe('/me', () => {
    beforeEach(async () => {
      await userTestUtils.clearUsers();
    });

    it('should return the user from the token', async () => {
      const user = await userTestUtils.createUser();
      const token = await TokenTestUtils.generateToken(user.id.toString());

      const context = createMockContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const response = await authController.me(context);

      expect(response.id).toEqual(user.id);
    });

    it('should return a 401 with an invalid token', async () => {
      const token = 'invalidtoken';
      const context = createMockContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const response = await authController.me(context);

      expect(response.message).toEqual('Unauthorised');
      expect(context.status).toEqual(401);
    });
  });

  describe('/login', () => {
    let user: IDbUser;
    const password = 'password';

    beforeEach(async () => {
      user = await userTestUtils.createUser({ password });
    });

    it('should return a session token and the current user with valid credentials', async () => {
      const context = createMockContext({
        requestBody: {
          email: user.email,
          password,
        },
      });

      const response = await authController.login(context);

      expect(response.user.id).toEqual(user.id);
      expect(response.token).toBeDefined();
    });
  });
});
