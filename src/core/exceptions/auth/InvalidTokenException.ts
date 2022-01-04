export default class InvalidTokenException extends Error {
  constructor() {
    super('Invalid token');
  }
}
