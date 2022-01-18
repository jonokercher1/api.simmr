interface IRepository {
  tableName: string;

  findOne<T>(query: { [key: string]: string | number }): Promise<T>;

  insert<I, T>(data: I): Promise<T[]>;

  insertOne<I, T>(data: I): Promise<T>;

  update<I, T>(query: { [key: string]: string | number }, data: I): Promise<T>;

  deleteOne(key: string, value: string | number): Promise<void>;

  deleteAll(primaryKey?: string): Promise<void>;
}

export default IRepository;
