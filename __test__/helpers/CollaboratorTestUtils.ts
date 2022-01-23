import TestDatabaseConnection from './TestDatabaseConnection';
import { IDbCollaborator } from '../../src/infrastructure/database/types/IDbCollaborator';

export default class CollaboratorTestUtils {
  constructor(private database: TestDatabaseConnection) {}

  public async attachToSpace(userId: number, spaceId: number): Promise<IDbCollaborator> {
    const spaceData: Partial<IDbCollaborator> = { userId, spaceId };

    const insertResult = await this.database.connection<IDbCollaborator>('collaborators')
      .insert(spaceData)
      .returning('*');

    return insertResult[0];
  }
}
