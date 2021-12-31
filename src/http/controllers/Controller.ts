import { inject, injectable } from 'tsyringe';
import Logger from '../../infrastructure/logging/Logger';

@injectable()
export default class Controller {
  constructor(@inject(Logger) protected readonly logger: Logger) {}
}
