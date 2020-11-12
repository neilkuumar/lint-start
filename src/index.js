const ora = require('ora');

const chalk = require('./chalk');
const methods = require('./methods');

let spinner;

async function setup() {
  try {
    // check if git has been setup
    const gitIsSetup = await methods.isGitRepo();
    if (!gitIsSetup) {
      throw new Error(`${chalk.error('Please setup git and run again')}`);
    }

    spinner = ora(`${chalk.action('Setup AirBnB Eslint Config')}`).start();
    await methods.airbnbEslintConfig();
    spinner.stopAndPersist({ symbol: '✅' });

    spinner = ora(`${chalk.action('Setup Prettier Eslint Config')}`).start();
    await methods.prettierEslintConfig();
    spinner.stopAndPersist({ symbol: '✅' });

    spinner = ora(`${chalk.action('Setup Prettier')}`).start();
    await methods.prettierSetup();
    spinner.stopAndPersist({ symbol: '✅' });

    // create files
  } catch (error) {
    if (spinner) {
      spinner.stopAndPersist({ symbol: '❌' });
    }
    console.error(chalk.error(error.message));
  }
}

module.exports = { setup };
