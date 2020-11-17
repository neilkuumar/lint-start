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
 * Commands
 */
const COMMANDS = {
  isGitRepo: 'git rev-parse --is-inside-work-tree 2>/dev/null',
  install: {
    babelEslint: 'npx install-peerdeps --dev babel-eslint',
    prettier: 'npm install --save-dev --save-exact prettier',
    eslint: {
      plugin: {
        jest: 'npm install -D eslint-plugin-jest',
        prettier: 'npm install --save-dev eslint-plugin-prettier',
      },
      config: {
        airbnb: 'npx install-peerdeps --dev eslint-config-airbnb',
        airbnbBase: 'npx install-peerdeps --dev eslint-config-airbnb-base',
        prettier: 'npm install --save-dev eslint-config-prettier',
      },
    },
  },
};

module.exports = {
  ESLINT_CONFIG_FOLDER,
  PRETTIER_CONFIG_FOLDER,
  PROJECT_ROOT,
  COMMANDS,
  PACKAGEJSON,
  REACT,
};
