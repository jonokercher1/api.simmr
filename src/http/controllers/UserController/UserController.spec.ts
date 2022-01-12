import { createMockContext } from '@shopify/jest-koa-mocks';
import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';
import UserController from './UserController';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import IAuthenticationService from '../../../core/contracts/IAuthenticationService';
import IUserService from '../../../core/contracts/IUserService';

describe('UserController', () => {
  let authenticationService: MockProxy<IAuthenticationService>;

  let userService: MockProxy<IUserService>;

  let userController: UserController;

  beforeAll(async () => {
    authenticationService = mock<IAuthenticationService>();

    userService = mock<IUserService>();

    userController = new UserController(userService, authenticationService);
  });

  describe('updateProfile', () => {
    it('should allow the user to update their profile', async () => {
      const initialUserData: IDbUser = {
        id: faker.datatype.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'password',
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
      };

      const newData = {
        firstName: faker.name.firstName(),
      };

      const context = createMockContext({
        requestBody: newData,
        headers: {
          authorization: 'token',
        },
      });

      authenticationService.getUserFromToken.mockResolvedValue(initialUserData);

      userService.updateUser.mockResolvedValue({ ...initialUserData, ...newData });

      const response = await userController.updateProfile(context);

      expect(response.firstName).not.toEqual(initialUserData.firstName);
      expect(response.firstName).toEqual(newData.firstName);
    });
  });
});
