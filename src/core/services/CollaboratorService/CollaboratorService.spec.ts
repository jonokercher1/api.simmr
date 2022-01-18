import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';
import CollaboratorService from './CollaboratorService';
import ICollaboratorService from '../../contracts/IICollaboratorService';
import ICollaboratorRepository from '../../contracts/infrastructure/database/ICollaboratorRepository';
import IDbCollaborator from '../../../infrastructure/database/types/IDbCollaborator';

describe('CollaboratorService', () => {
  let collaboratorService: ICollaboratorService;
  let collaboratorRepository: MockProxy<ICollaboratorRepository>;

  beforeAll(() => {
    collaboratorRepository = mock<ICollaboratorRepository>();
    collaboratorService = new CollaboratorService(collaboratorRepository);
  });

  describe('getCollaboratorsInSpace', () => {
    it('should return all collaborators in a space', async () => {
      const spaceId = 1;

      const collaborators: IDbCollaborator[] = [{
        spaceId,
        id: faker.datatype.number(),
        email: faker.internet.email(),
        password: faker.internet.password(12),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
      }];

      collaboratorRepository.getBySpaceId.mockResolvedValueOnce(collaborators);

      const result = await collaboratorService.getCollaboratorsInSpace(spaceId);

      expect(result.length).toEqual(collaborators.length);
      expect(result[0].email).toEqual(collaborators[0].email);
    });
  });

  describe('getUsersCollaborators', () => {
    it('should return all collaborators in a users space, but not the user itself', async () => {
      const userId = 1;

      const collaborators: IDbCollaborator[] = [{
        spaceId: 1,
        id: faker.datatype.number(),
        email: faker.internet.email(),
        password: faker.internet.password(12),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
      }];

      collaboratorRepository.getUsersCollaborators.mockResolvedValueOnce(collaborators);

      const result = await collaboratorService.getUsersCollaborators(userId);

      expect(result.length).toEqual(collaborators.length);
      expect(result[0].email).toEqual(collaborators[0].email);
    });
  });

  describe('updateSpaceCollaborators', () => {
    describe('adding collaborators to a space', () => {
      it('should attach new collaborators to the space', async () => {
        const spaceId = 1;

        const newCollaboratorId = faker.datatype.number();

        collaboratorRepository.getBySpaceId.mockResolvedValueOnce([]);

        collaboratorRepository.addNewCollaboratorsToSpace.mockResolvedValueOnce([{
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          spaceId,
          id: newCollaboratorId,
          createdAt: faker.datatype.datetime(),
          updatedAt: faker.datatype.datetime(),
          password: faker.internet.password(12),
        }]);

        const result = await collaboratorService.updateSpaceCollaborators(spaceId, [newCollaboratorId]);

        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(newCollaboratorId);
        expect(result[0].spaceId).toEqual(spaceId);
      });
    });

    describe('removing collaborators from a space', () => {
      it('should detach a collaborator from the space if they have been removed', async () => {
        const spaceId = 1;

        const removedCollaboratorId = faker.datatype.number();

        const spaceCollaborators = [
          {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            spaceId,
            id: faker.datatype.number(),
            createdAt: faker.datatype.datetime(),
            updatedAt: faker.datatype.datetime(),
            password: faker.internet.password(12),
          },
          {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            spaceId,
            id: removedCollaboratorId,
            createdAt: faker.datatype.datetime(),
            updatedAt: faker.datatype.datetime(),
            password: faker.internet.password(12),
          },
        ];

        collaboratorRepository.getBySpaceId.mockResolvedValueOnce(spaceCollaborators);

        const remainingSpaceCollaborators = spaceCollaborators.filter((c) => c.id !== removedCollaboratorId);

        collaboratorRepository.removeCollaboratorsFromSpace.mockResolvedValueOnce(remainingSpaceCollaborators);

        collaboratorRepository.addNewCollaboratorsToSpace.mockResolvedValueOnce(remainingSpaceCollaborators);

        const result = await collaboratorService.updateSpaceCollaborators(spaceId, remainingSpaceCollaborators.map(({ id }) => id));

        expect(result).toHaveLength(1);
        expect(result.find((r) => r.id === removedCollaboratorId)).toBeUndefined();
      });
      it.todo('should unassign all items from a collaborator if they have been removed');
    });
  });
});
