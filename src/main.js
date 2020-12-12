const ora = require('ora');
const chalk = require('./chalk_helper');
const eslint = require('./eslint_methods');
const prettier = require('./prettier_methods');
const helpers = require('./helpers');

/**
 * Entry point to the application
 */
async function setup() {
  try {
    try {
      // only continue if git has been setup (allow user to rollback)
      await helpers.isGitRepo();
    } catch (error) {
      throw new Error('Please run within a project with git.');
    }

    const hasReact = helpers.doesProjectHaveReact();
    const spinner = ora();
    if (hasReact) {
      spinner.info(chalk.msg('-- setting up for react --'));
    } else {
      spinner.info(chalk.msg('-- setting up for nodejs --'));
    }

    await helpers.runAction({
      action: () => eslint.eslintConfig(hasReact),
      text: 'setup eslint config',
    });

    await helpers.runAction({
      action: () => prettier.prettierEslintConfig(hasReact),
      text: 'setup prettier eslint config',
    });

    await helpers.runAction({
      action: prettier.prettierSetup,
      text: 'setup prettier',
    });
  } catch (error) {
    console.error(chalk.error(error));
  }
}

module.exports = { setup };
