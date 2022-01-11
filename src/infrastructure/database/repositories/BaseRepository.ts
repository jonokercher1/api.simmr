import { Knex } from 'knex';
import { inject, injectable } from 'tsyringe';
import IRepository from '../../../core/contracts/infrastructure/database/IRepository';
import IDatabaseConnection from '../../../core/contracts/infrastructure/database/IDatabaseConnection';

@injectable()
export default class BaseRepository implements IRepository {
  public tableName: string = '';

  protected connection;

  constructor(@inject('Database') databaseConnector: IDatabaseConnection<Knex>) {
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

  public async update<I, T>(query: { [key: string]: string | number }, data: I): Promise<T> {
    const result = await this.connection(this.tableName)
      .where(query)
      .update(data)
      .returning('*');

    return result[0];
  }

  public async deleteOne(key: string, value: string | number) {
    await this.connection(this.tableName)
      .where({ [key]: value })
      .delete();
  }

  public async deleteAll(primaryKey = 'id') {
    await this.connection(this.tableName).whereNotNull(primaryKey).delete();
  }
}
