const util = require('util');
const exec = util.promisify(require('child_process').exec);

const ora = require('ora');
const chalk = require('./chalk_helper');

async function executeCmd(command) {
  try {
    const { stdout } = await exec(command);
    return stdout;
  } catch (e) {
    console.error(e);
    return e;
  }
}

async function isGitRepo() {
  return executeCmd('git rev-parse --is-inside-work-tree 2>/dev/null');
}

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
