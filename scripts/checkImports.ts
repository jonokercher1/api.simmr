import 'reflect-metadata';
import chalk from 'chalk';
import path from 'path';
import { run as checkDependencyImports } from 'good-fences';
import { container } from 'tsyringe';
import Logger from '../src/infrastructure/logging/Logger';

const logger = container.resolve(Logger);

const checkForIllegalImports = async () => {
  const { errors } = await checkDependencyImports({
    project: path.join(__dirname, '../tsconfig.json'),
    rootDir: path.join(__dirname, '../src'),
  });

  if (errors && errors.length) {
    logger.error(chalk.red(JSON.stringify(errors, null, 2)));
  }
};

(async () => {
  await checkForIllegalImports();
})();
