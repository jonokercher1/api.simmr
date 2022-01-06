import supertest from 'supertest';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import TestDatabaseConnector from '../../../../__test__/mocks/database';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import server from '../../../core/server';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import MockUserRepository from '../../../../__test__/mocks/repository/MockUserRepository';

describe('AuthController', () => {
  let authenticationService: AuthenticationService;
  let userTestUtils: UserTestUtils;
  const database = new TestDatabaseConnector();

  const app = server.listen();
  const request = supertest(app);

  beforeAll(() => {
    const userRepository = new MockUserRepository();
    authenticationService = new AuthenticationService(userRepository);
    userTestUtils = new UserTestUtils(userRepository);
  });

  afterAll(async () => {
    await app.close();
    await database.disconnect();
  });

  describe('/me', () => {
    beforeEach(async () => {
      await userTestUtils.clearUsers();
    });

    it('should return the user from the token', async () => {
      const user = await userTestUtils.createUser();
      const token = await TokenTestUtils.generateToken(user.id.toString());
      const tokenData = await authenticationService.getUserFromToken(token);

      expect(tokenData.id).toEqual(user.id);

      const response = await request.get('/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      console.log('🚀 ~ file: AuthController.spec.ts ~ line 43 ~ it ~ response', response.body);
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

  describe('/login', () => {
    let user: IDbUser;
    const password = 'password';

    beforeEach(async () => {
      user = await userTestUtils.createUser({ password });
    });

    it('should return a session token and the current user with valid credentials', async () => {
      const response = await request.post('/login')
        .send({
          email: user.email,
          password,
        });

      expect(response.body.user.id).toEqual(user.id);
      expect(response.body.token).toBeDefined();
    });
  });
});
