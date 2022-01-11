import { createMockContext } from '@shopify/jest-koa-mocks';
import faker from 'faker';
import UserController from './UserController';
import MockUserRepository from '../../../../__test__/mocks/repository/MockUserRepository';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import UserService from '../../../core/services/UserService/UserService';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';

describe('UserController', () => {
  let userRepository: MockUserRepository;
  let userController: UserController;

  beforeAll(() => {
    userRepository = new MockUserRepository();
    const authenticationService = new AuthenticationService(userRepository);
    const userService = new UserService(userRepository);
    userController = new UserController(userService, authenticationService);
  });

  describe('updateProfile', () => {
    it('should allow the user to update their profile', async () => {
      const initialUserData: Partial<IDbUser> = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'password',
      };

      const [user] = await userRepository.insert<Partial<IDbUser>, IDbUser>(initialUserData);
      const token = await TokenTestUtils.generateToken(user.id.toString());

      const newData = {
        firstName: faker.name.firstName(),
      };

      const context = createMockContext({
        requestBody: newData,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const response = await userController.updateProfile(context);

      expect(response.firstName).not.toEqual(initialUserData.firstName);
      expect(response.firstName).toEqual(newData.firstName);
    });
  });
});
