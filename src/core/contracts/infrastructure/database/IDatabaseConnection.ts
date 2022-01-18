interface IDatabaseConnection<T> {
  connection: T;

  connect: () => T;

  disconnect: () => Promise<void>;
}

export default IDatabaseConnection;
