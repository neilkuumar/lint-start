const chalk = require('./chalk_helper');
const eslint = require('./eslint_methods');
const prettier = require('./prettier_methods');
const helpers = require('./helpers');
const { runAction } = require('./helpers');

/**
 * Entry point to the application
 */
async function setup() {
  try {
    // only continue if git has been setup (allow user to rollback)
    const gitIsSetup = await helpers.isGitRepo();
    if (!gitIsSetup) {
      throw new Error(`${chalk.error('Please setup git and run again')}`);
    }

    await runAction({
      action: eslint.eslintConfig,
      text: 'setup eslint config',
    });

    await runAction({
      action: prettier.prettierEslintConfig,
      text: 'setup prettier eslint config',
    });

    await runAction({
      action: prettier.prettierSetup,
      text: 'setup prettier',
    });
  } catch (error) {
    console.error(chalk.error(error));
  }
}

module.exports = { setup };
