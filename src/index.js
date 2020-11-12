const chalk = require('chalk');
const ora = require('ora');

const methods = require('./methods');

const chalkAction = chalk.bold.greenBright;
const chalkError = chalk.bold.redBright;

let spinner;

async function setup() {
  try {
    // check if git has been setup
    const gitIsSetup = await methods.isGitRepo();
    if (!gitIsSetup) {
      throw new Error(`${chalkError('Please setup git and run again')}`);
    }

    spinner = ora(`${chalkAction('Setup AirBnB Eslint Config')}`).start();
    await methods.airbnbEslintConfig();
    spinner.stopAndPersist({ symbol: '✅' });

    spinner = ora(`${chalkAction('Setup Prettier Eslint Config')}`).start();
    await methods.prettierEslintConfig();
    spinner.stopAndPersist({ symbol: '✅' });

    spinner = ora(`${chalkAction('Setup Prettier')}`).start();
    await methods.prettierSetup();
    spinner.stopAndPersist({ symbol: '✅' });

    // create files
  } catch (error) {
    if (spinner) {
      spinner.stopAndPersist({ symbol: '❌' });
    }
    console.error(error.message);
  }
}

module.exports = { setup };
