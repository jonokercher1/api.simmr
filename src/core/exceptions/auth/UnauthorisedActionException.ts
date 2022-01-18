export default class UnauthorisedActionException extends Error {
  constructor(details?: string) {
    super(`Unauthorised action${details ? `: ${details}` : ''}`);
  }
}
