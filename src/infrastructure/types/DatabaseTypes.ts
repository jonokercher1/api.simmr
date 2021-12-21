export type ConnectionConfigType = 'development' | 'production';

export interface DatabaseConnection<T> {
  connection: T;
  connect: () => T;
}
