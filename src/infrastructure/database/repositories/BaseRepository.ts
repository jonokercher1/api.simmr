import { Knex } from 'knex';
import { DatabaseConnection } from '../../../../user/services/database/DatabaseClient';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class BaseRepository {
  public tableName: string = '';

  protected readonly connection;

  constructor(@inject('Database') databaseConnector: DatabaseConnection<Knex>) {
    this.connection = databaseConnector.connect();
  }

  public async findOne<T>(query: { [key: string]: string | number }): Promise<T> {
    return this.connection(this.tableName).where(query).first();
  }

  public async insert<I, T>(data: I): Promise<T[]> {
    return this.connection(this.tableName).insert(data).returning('*');
  }

  public async insertOne<I, T>(data: I): Promise<T> {
    const result = await this.insert<I, T>(data);
    return result[0];
  }

  public async deleteOne(key: string, value: string | number) {
    return this.connection(this.tableName)
      .where({ [key]: value })
      .delete();
  }

  public async deleteAll(primaryKey = 'id') {
    return this.connection(this.tableName).whereNotNull(primaryKey).delete();
  }
}
