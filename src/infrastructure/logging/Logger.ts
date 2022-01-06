import { singleton } from 'tsyringe';
import {
  createLogger,
  Logger as Winston,
  transports,
  format,
} from 'winston';
import ILogger from '../../core/contracts/infrastructure/logger/ILogger';

@singleton()
export default class Logger implements ILogger {
  private logManager: Winston;

  private logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  constructor() {
    this.logManager = this.createLoggerInstance();
    this.addTransports();
  }

  public error(message: string, ...meta: any[]): void {
    this.logManager.error(message, ...meta);
  }

  public warn(message: string, ...meta: any[]): void {
    this.logManager.warn(message, ...meta);
  }

  public info(message: string, ...meta: any[]): void {
    this.logManager.info(message, ...meta);
  }

  public debug(message: string, ...meta: any[]): void {
    this.logManager.debug(message, ...meta);
  }

  private createLoggerInstance(): Winston {
    return createLogger({ levels: this.logLevels, level: 'debug' });
  }

  private addTransports() {
    this.logManager.add(this.initConsoleTransporter());
  }

  private initConsoleTransporter(): transports.ConsoleTransportInstance {
    return new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    });
  }
}
