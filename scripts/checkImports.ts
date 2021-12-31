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
    logger.info('\n');
    errors.map((error) => logger.error(chalk.red(`${error.message}:`, error.sourceFile, `\n Importing: ${error.rawImport} \n`)));
    process.exit(1);
  }
};

(async () => {
  await checkForIllegalImports();
})();
