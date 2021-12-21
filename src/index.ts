import { run as checkDependencyImports } from 'good-fences';
import chalk from 'chalk';
import server from './core/server';

const checkForIllegalImports = async () => {
  const { errors } = await checkDependencyImports({
    project: './tsconfig.json',
    rootDir: './src',
  });

  if (errors && errors.length) {
    console.log('\n');
    errors.map((error) => console.error(chalk.red(`${error.message}:`, error.sourceFile, `\n Importing: ${error.rawImport} \n`)));
    process.exit(1);
  }
};

(async () => {
  console.log(chalk.green('Checking dependency imports...'));

  await checkForIllegalImports();

  server.listen(process.env.API_PORT, () => {
    console.log(chalk.whiteBright(`Server is listening on port ${process.env.API_PORT}`));
  });
})();
