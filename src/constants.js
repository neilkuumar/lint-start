const path = require('path');
const fs = require('fs');
const chalk = require('./chalk_helper');

const PACKAGEJSON = 'package.json';
const REACT = 'react';
const CONFIG_FOLDER = `${__dirname}/config_files/`;
const ESLINT_CONFIG_FOLDER = `${CONFIG_FOLDER}/eslint`;
const PRETTIER_CONFIG_FOLDER = `${CONFIG_FOLDER}/prettier`;

const PROJECT_ROOT = require.main.paths[0]
  .split('node_modules')[0]
  .slice(0, -1);

function doesProjectHaveReact() {
  const packagePath = path.resolve(`${PROJECT_ROOT}`, PACKAGEJSON);
  const packageExists = fs.existsSync(packagePath);

  if (!packageExists) throw new Error(chalk.error('No package.json detected!'));

  const packageJson = JSON.parse(fs.readFileSync(packagePath));
  const { dependencies, devDependencies } = packageJson;
  const allDependencies = { ...dependencies, ...devDependencies };

  const hasReact = Object.keys(allDependencies).some((dep) => dep === REACT);

  if (hasReact) {
    console.log(chalk.msg('-- ⚛️ react detected --'));
  } else {
    console.log(chalk.msg('-- setting up for nodejs --'));
  }
}

module.exports = {
  ESLINT_CONFIG_FOLDER,
  PRETTIER_CONFIG_FOLDER,
  PROJECT_ROOT,
  HAS_REACT: doesProjectHaveReact(),
};
