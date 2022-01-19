import { createMockContext } from '@shopify/jest-koa-mocks';
import faker from 'faker';
import bcrypt from 'bcrypt';
import { mock, MockProxy } from 'jest-mock-extended';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import AuthController from './AuthController';
import IUserRepository from '../../../core/contracts/infrastructure/database/IUserRepository';
import IUserService from '../../../core/contracts/IUserService';
import IAuthenticationService from '../../../core/contracts/IAuthenticationService';
import UserNotFoundException from '../../../core/exceptions/auth/UserNotFoundException';
import InvalidCredentialsException from '../../../core/exceptions/auth/InvalidCrednetialsException';
import UserExistsException from '../../../core/exceptions/database/UserExistsException';

// TODO: rewrite as proper integration test
describe('AuthController', () => {
  let authenticationService: MockProxy<IAuthenticationService>;

  let userService: MockProxy<IUserService>;

  let userTestUtils: UserTestUtils;

  let authController: AuthController;

  let userRepository: MockProxy<IUserRepository>;

  let userData: IDbUser;

  beforeAll(async () => {
    userData = {
      id: faker.datatype.number(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: await bcrypt.hash(faker.internet.password(12), 10),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    };

    userRepository = mock<IUserRepository>({
      insert: jest.fn().mockResolvedValue([userData]),
    });

    authenticationService = mock<IAuthenticationService>();

    userService = mock<IUserService>();

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

      authenticationService.getUserFromToken.mockResolvedValueOnce(userData);

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

      authenticationService.getUserFromToken.mockImplementationOnce(() => { throw new UserNotFoundException(); });

      const response = await authController.me(context);

      expect(response.message).toEqual('Unauthorised');
      expect(context.status).toEqual(401);
    });
  });

  describe('/login', () => {
    const password: string = 'password';
    let user: IDbUser;

    beforeAll(async () => {
      user = {
        id: faker.datatype.number(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await bcrypt.hash(password, 10),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
      };
    });

    it('should return a session token and the current user with valid credentials', async () => {
      const context = createMockContext({
        requestBody: {
          email: user.email,
          password,
        },
      });

      authenticationService.generateToken.mockReturnValueOnce('token');

      authenticationService.verifyCredentials.mockResolvedValueOnce(user);

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

      authenticationService.verifyCredentials.mockImplementationOnce(() => { throw new UserNotFoundException(); });

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

      authenticationService.verifyCredentials.mockImplementationOnce(() => { throw new InvalidCredentialsException(); });

      const response = await authController.login(context);

      expect(response.message).toEqual('Invalid Credentials');
      expect(context.status).toEqual(400);
    });
  });

  describe('/register', () => {
    it('should return the new user with a valid token', async () => {
      const userInput = {
        ...userData,
        password: 'password',
      };

      userService.createUser.mockResolvedValueOnce(userData);

      authenticationService.generateToken.mockReturnValueOnce('token');

      const context = createMockContext({ requestBody: userInput });

      const result = await authController.register(context);

      expect(result.token).toBeDefined();
      expect(result.user.firstName).toEqual(userInput.firstName);
      expect(result.user.lastName).toEqual(userInput.lastName);
      expect(result.user.email).toEqual(userInput.email);
    });

    it('should fail to create a new user with an email that already exists', async () => {
      const context = createMockContext({ requestBody: userData });

      userService.createUser.mockImplementationOnce(() => { throw new UserExistsException('email'); });

      const response = await authController.register(context);

      expect(response.message).toEqual('User with that email already exists');
      expect(context.status).toEqual(400);
    });
  });
});
