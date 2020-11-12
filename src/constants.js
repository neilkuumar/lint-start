const path = require('path');
const fs = require('fs');
const chalk = require('./chalk_helper');

const PACKAGEJSON = 'package.json';
const REACT = 'react';

/**
 * Path to config folder
 */
const CONFIG_FOLDER = `${__dirname}/config_files/`;

/**
 * Path to eslint config files
 */
const ESLINT_CONFIG_FOLDER = `${CONFIG_FOLDER}/eslint`;

/**
 * Path to prettier config files
 */
const PRETTIER_CONFIG_FOLDER = `${CONFIG_FOLDER}/prettier`;

/**
 * The root of the project/repo
 */
const PROJECT_ROOT = require.main.paths[0]
  .split('node_modules')[0]
  .slice(0, -1);

/**
 * Returns true if the repo has react as a dependency
 */
function doesProjectHaveReact() {
  const packagePath = path.resolve(`${PROJECT_ROOT}`, PACKAGEJSON);
  const packageExists = fs.existsSync(packagePath);

  if (!packageExists) throw new Error(chalk.error('No package.json detected!'));

  const packageJson = JSON.parse(fs.readFileSync(packagePath));

  // merge all dependencies incase user has installed in wrong location
  const { dependencies, devDependencies } = packageJson;
  const allDependencies = { ...dependencies, ...devDependencies };

  // check if react is included
  const hasReact = Object.keys(allDependencies).some((dep) => dep === REACT);

  if (hasReact) {
    console.log(chalk.msg('-- ⚛️ react detected --'));
  } else {
    console.log(chalk.msg('-- setting up for nodejs --'));
  }

  return hasReact;
}

module.exports = {
  ESLINT_CONFIG_FOLDER,
  PRETTIER_CONFIG_FOLDER,
  PROJECT_ROOT,
  HAS_REACT: doesProjectHaveReact(),
};
