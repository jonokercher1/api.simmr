import { inject, injectable } from 'tsyringe';
import ILogger from '../../core/contracts/infrastructure/logger/ILogger';

@injectable()
export default class Controller {
  constructor(@inject('ILogger') protected logger: ILogger) {}
}
