const util = require('util');
const exec = util.promisify(require('child_process').exec);

const ora = require('ora');
const chalk = require('./chalk_helper');

/**
 * Executes a shell command
 * @param {String} command
 * @returns {Promise}
 */
async function executeCmd(command) {
  try {
    const { stdout } = await exec(command);
    return stdout;
  } catch (e) {
    console.error(e);
    return e;
  }
}

/**
 * Returns true if a project is a git repo
 * @returns {Boolean}
 */
async function isGitRepo() {
  return executeCmd('git rev-parse --is-inside-work-tree 2>/dev/null');
}

/**
 * Runs an action with a spinner
 * @param {Object} action
 * @param {Function} action.action action to run
 * @param {String} action.text string to log
 */
async function runAction({ action, text }) {
  const spinner = ora(`${chalk.action(text)}`).start();
  try {
    await action();
    spinner.stopAndPersist({ symbol: '✅' });
  } catch (error) {
    spinner.stopAndPersist({ symbol: '❌' });
    throw error;
  }
}

module.exports = { executeCmd, isGitRepo, runAction };
