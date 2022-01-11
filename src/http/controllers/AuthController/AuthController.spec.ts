import { createMockContext } from '@shopify/jest-koa-mocks';
import faker from 'faker';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import MockUserRepository from '../../../../__test__/mocks/repository/MockUserRepository';
import AuthController from './AuthController';
import UserService from '../../../core/services/UserService/UserService';

describe('AuthController', () => {
  let authenticationService: AuthenticationService;
  let userService: UserService;
  let userTestUtils: UserTestUtils;
  let authController: AuthController;
  let userRepository: MockUserRepository;

  beforeAll(() => {
    userRepository = new MockUserRepository();
    authenticationService = new AuthenticationService(userRepository);
    userService = new UserService(userRepository);
    userTestUtils = new UserTestUtils(userRepository);
    authController = new AuthController(authenticationService, userService);
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

    it('should return a useful error message when using an email that doesn\'t exist', async () => {
      const context = createMockContext({
        requestBody: {
          email: 'invalid@email.com',
          password,
        },
      });

      const response = await authController.login(context);

      expect(response.message).toEqual('User not found');
      expect(context.status).toEqual(400);
    });

    it('should return a useful error message when using the incorrect password', async () => {
      const context = createMockContext({
        requestBody: {
          email: user.email,
          password: 'incorrectpassword',
        },
      });

      const response = await authController.login(context);

      expect(response.message).toEqual('Invalid Credentials');
      expect(context.status).toEqual(400);
    });
  });

  describe('/register', () => {
    it('should create a new user with valid date', async () => {
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'password',
      };

      const context = createMockContext({ requestBody: userData });
      await authController.register(context);
      const userStored = await userRepository.findOne<IDbUser>({ email: userData.email });

      expect(userStored.firstName).toEqual(userData.firstName);
      expect(userStored.lastName).toEqual(userData.lastName);
      expect(userStored.email).toEqual(userData.email);
    });

    it('should return the new user with a valid token', async () => {
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'password',
      };

      const context = createMockContext({ requestBody: userData });

      const response = await authController.register(context);

      expect(response.user.firstName).toEqual(userData.firstName);
      expect(response.user.lastName).toEqual(userData.lastName);
      expect(response.user.email).toEqual(userData.email);
      expect(response.token).toBeDefined();
    });

    it('should fail to create a new user with an email that already exists', async () => {
      const email = faker.internet.email();

      await userTestUtils.createUser({ email });

      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password: 'password',
      };

      const context = createMockContext({ requestBody: userData });

      const response = await authController.register(context);

      expect(response.message).toEqual('User with that email already exists');
      expect(context.status).toEqual(400);
    });
  });
});
