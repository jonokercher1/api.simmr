import { createMockContext } from '@shopify/jest-koa-mocks';
import CollaboratorController from './CollaboratorController';
import CollaboratorRepository from '../../../infrastructure/database/repositories/CollaboratorRepository';
import TestDatabaseConnection from '../../../../__test__/helpers/TestDatabaseConnection';
import CollaboratorService from '../../../core/services/CollaboratorService/CollaboratorService';

describe('CollaboratorController', () => {
  let collaboratorController: CollaboratorController;

  beforeAll(() => {
    const databaseConnection = new TestDatabaseConnection();
    const collaboratorRepository = new CollaboratorRepository(databaseConnection);
    const collaboratorService = new CollaboratorService(collaboratorRepository);
    collaboratorController = new CollaboratorController(collaboratorService);
  });

  describe('getSpaceCollaborators', () => {
    it('should error if the space does not exist', async () => {
      const mockContext = createMockContext({ url: '/collaborators/1' });

      const response = await collaboratorController.getSpaceCollaborators(mockContext);

      expect(response?.message).toEqual('Invalid Space Id');
      expect(mockContext.status).toBe(400);
    });

    it.todo('should error if the user does not belong to the space');

    it.todo('should return the collaborators in the space, but not the current user');
  });
});
