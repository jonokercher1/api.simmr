import faker from 'faker';
import IDbSpace from '../../src/infrastructure/database/types/IDbSpace';
import TestDatabaseConnection from './TestDatabaseConnection';

export default class SpaceTestUtils {
  constructor(private database: TestDatabaseConnection) {}

  public async createSpace(id?: number): Promise<IDbSpace> {
    const spaceData: Partial<IDbSpace> = {
      id: id ?? faker.datatype.number(),
    };

    const insertResult = await this.database.connection<IDbSpace>('spaces')
      .insert(spaceData)
      .returning('*');

    return insertResult[0];
  }
}
