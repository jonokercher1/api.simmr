/* eslint-disable @typescript-eslint/no-unused-vars */
import faker from 'faker';
import IRepository from '../../../src/core/contracts/infrastructure/database/IRepository';

export default class MockRepository implements IRepository {
  tableName: string;

  private dataset: any[] = [];

  public addToDataset<T>(data: Partial<T>): T[] {
    this.dataset.push(data);

    return this.dataset;
  }

  public clearDataset() {
    this.dataset = [];
  }

  async findOne<T>(query: { [key: string]: string | number; }): Promise<T> {
    const key = Object.keys(query)[0];
    const value = Object.values(query)[0];

    return this.dataset.find((i) => i[key].toString() === value.toString());
  }

  async insert<I, T>(data: I): Promise<T[]> {
    const insertData = 'id' in data ? data : { ...data, id: faker.datatype.number() };
    this.dataset.push(insertData);

    return this.dataset;
  }

  async insertOne<I, T>(data: I): Promise<T> {
    const insertData = 'id' in data ? data : { ...data, id: faker.datatype.number() };
    const itemCount = this.dataset.push(insertData);

    return this.dataset[itemCount - 1];
  }

  async deleteOne(key: string, value: string | number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async deleteAll(primaryKey?: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
