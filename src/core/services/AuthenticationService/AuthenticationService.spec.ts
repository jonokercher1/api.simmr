import { JsonWebTokenError } from 'jsonwebtoken';
import { mock, MockProxy } from 'jest-mock-extended';
import faker from 'faker';
import bcrypt from 'bcrypt';
import AuthenticationService from './AuthenticationService';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import IUserRepository from '../../contracts/infrastructure/database/IUserRepository';
import IAuthenticationService from '../../contracts/IAuthenticationService';

describe('AuthenticationService', () => {
  let authenticationService: IAuthenticationService;

  let userRepository: MockProxy<IUserRepository>;

  beforeAll(async () => {
    userRepository = mock<IUserRepository>();

    authenticationService = new AuthenticationService(userRepository);
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
      const id = faker.datatype.number();
      userRepository.findOne.mockResolvedValueOnce({
        id,
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await bcrypt.hash(faker.internet.password(12), 10),
      });

      const token = await TokenTestUtils.generateToken(id.toString());

      const tokenData = await authenticationService.getUserFromToken(token);

      expect(tokenData.id).toEqual(id);
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
      const password = faker.internet.password(12);

      const email = faker.internet.email();

      const id = faker.datatype.number();

      userRepository.findOne.mockResolvedValueOnce({
        id,
        email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await bcrypt.hash(password, 10),
      });

      const userFromCredentials = await authenticationService.verifyCredentials(email, password);

      expect(userFromCredentials.id).toEqual(id);
      expect(userFromCredentials.email).toEqual(email);
    });

    it('should error if no user with specified email', async () => {
      try {
        await authenticationService.verifyCredentials('invalidemail', 'password');
      } catch (e: any) {
        expect(e.message).toEqual('User not found');
      }
    });

    it('should error with valid email and invalid password', async () => {
      const email = faker.internet.email();

      userRepository.findOne.mockResolvedValueOnce({
        id: faker.datatype.number(),
        email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await bcrypt.hash(faker.internet.password(12), 10),
      });

      try {
        await authenticationService.verifyCredentials(email, 'invalidpassword');
      } catch (e: any) {
        expect(e.message).toEqual('Invalid Credentials');
      }
    });
  });
});
