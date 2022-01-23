import { createMockContext } from '@shopify/jest-koa-mocks';
import CollaboratorController from './CollaboratorController';
import CollaboratorRepository from '../../../infrastructure/database/repositories/CollaboratorRepository';
import TestDatabaseConnection from '../../../../__test__/helpers/TestDatabaseConnection';
import CollaboratorService from '../../../core/services/CollaboratorService/CollaboratorService';
import SpaceTestUtils from '../../../../__test__/helpers/SpaceTestUtils';
import CollaboratorTestUtils from '../../../../__test__/helpers/CollaboratorTestUtils';
import UserTestUtils from '../../../../__test__/helpers/UserTestUtils';
import TokenTestUtils from '../../../../__test__/helpers/TokenTestUtils';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import UserRepository from '../../../infrastructure/database/repositories/UserRepository';

describe('CollaboratorController', () => {
  let collaboratorController: CollaboratorController;
  let databaseConnection: TestDatabaseConnection;

  beforeAll(() => {
    databaseConnection = new TestDatabaseConnection();
    const collaboratorRepository = new CollaboratorRepository(databaseConnection);
    const userRepository = new UserRepository(databaseConnection);
    const collaboratorService = new CollaboratorService(collaboratorRepository);
    const authenticationService = new AuthenticationService(userRepository);
    collaboratorController = new CollaboratorController(collaboratorService, authenticationService);
  });

  afterAll(async () => {
    await databaseConnection.disconnect();
  });

  describe('getSpaceCollaborators', () => {
    let spaceTestUtils: SpaceTestUtils;

    let collaboratorTestUtils: CollaboratorTestUtils;

    let userTestUtils: UserTestUtils;

    beforeAll(() => {
      spaceTestUtils = new SpaceTestUtils(databaseConnection);
      collaboratorTestUtils = new CollaboratorTestUtils(databaseConnection);
      userTestUtils = new UserTestUtils(databaseConnection);
    });

    it('should error if the space does not exist', async () => {
      const mockContext = createMockContext({ url: '/collaborators/1' });

      const response = await collaboratorController.getSpaceCollaborators(mockContext);

      expect(response?.message).toEqual('Invalid Space Id');
      expect(mockContext.status).toBe(400);
    });

    it('should error if the user does not belong to the space', async () => {
      const user = await userTestUtils.createUser();

      const space = await spaceTestUtils.createSpace();

      const token = await TokenTestUtils.generateToken(user.id.toString());

      const mockContext = createMockContext({
        url: `/collaborators/${space.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        customProperties: {
          params: {
            spaceId: space.id,
          },
        },
      });

      const result = await collaboratorController.getSpaceCollaborators(mockContext);

      expect(mockContext.status).toEqual(400);
      expect(result.message).toEqual('Unauthorised action: User does not belong to space');
    });

    it('should return the collaborators in the space, but not the current user', async () => {
      const user = await userTestUtils.createUser();

      const space = await spaceTestUtils.createSpace();

      await collaboratorTestUtils.attachToSpace(user.id, space.id);

      const collaborators = [
        await userTestUtils.createUser(),
        await userTestUtils.createUser(),
      ];

      const token = await TokenTestUtils.generateToken(user.id.toString());

      collaborators.forEach(async (c) => collaboratorTestUtils.attachToSpace(c.id, space.id));

      const mockContext = createMockContext({
        url: `/collaborators/${space.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        customProperties: {
          params: {
            spaceId: space.id,
          },
        },
      });

      const result: any = await collaboratorController.getSpaceCollaborators(mockContext);

      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(collaborators[0].id);
      expect(result[1].id).toEqual(collaborators[1].id);

      const returnedIds = result.map(({ id }: { id: any }) => id);

      expect(returnedIds).not.toContain(user.id);
    });
  });
});
