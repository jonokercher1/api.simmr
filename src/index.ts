import 'reflect-metadata';
import chalk from 'chalk';
import { container } from 'tsyringe';
import Logger from './infrastructure/logging/Logger';
import server from './core/server';

const logger = container.resolve(Logger);

server.listen(process.env.API_PORT, () => {
  logger.info(chalk.green(`Server is listening on port ${process.env.API_PORT}`));
});
