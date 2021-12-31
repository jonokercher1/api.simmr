export interface DatabaseConnection<T> {
  connection: T;
  connect: () => T;
  disconnect: () => Promise<void>;
}
