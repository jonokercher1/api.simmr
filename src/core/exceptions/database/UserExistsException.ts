export default class UserExistsException extends Error {
  constructor(field: string = 'id') {
    super(`User with that ${field} already exists`);
  }
}
