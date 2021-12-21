export interface DatabaseConnection<T> {
  connection: T;
  connect: () => T;
}
