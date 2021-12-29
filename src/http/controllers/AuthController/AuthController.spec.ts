import supertest from 'supertest';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import TestDatabaseConnector from '../../../../__test__/mocks/database';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import UserRepository from '../../../infrastructure/database/repositories/UserRepository';
import server from '../../../core/server';

describe('AuthController', () => {
  let authenticationService: AuthenticationService;
  let userTestUtils: UserTestUtils;
  const database = new TestDatabaseConnector();

  const app = server.listen();
  const request = supertest(app);

  beforeAll(() => {
    const userRepository = new UserRepository(database);
    authenticationService = new AuthenticationService(userRepository);
    userTestUtils = new UserTestUtils();
  });

  afterAll(async () => {
    await app.close();
    await userTestUtils.database.disconnect();
    await database.disconnect();
  });

  describe('/me', () => {
    it('should return the user from the token', async () => {
      const user = await userTestUtils.createUser();
      const token = await TokenTestUtils.generateToken(user.id.toString());
      const tokenData = await authenticationService.getUserFromToken(token);

      expect(tokenData.id).toEqual(user.id);

      const response = await request.get('/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toEqual(user.id);
    });

    it('should return a 401 with an invalid token', async () => {
      const token = 'invalidtoken';
      const response = await request.get('/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      expect(response.body.message).toEqual('Unauthorised');
    });
  });
});
