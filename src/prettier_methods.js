const fs = require('fs');
const path = require('path');

const { executeCmd } = require('./helpers');
const {
  PROJECT_ROOT,
  PRETTIER_CONFIG_FOLDER,
  COMMANDS,
} = require('./constants');

const PRETTIERRC = '.prettierrc';
const PRETTIERIGNORE = '.prettierignore';

/**
 * Install prettier eslint config
 */
async function prettierEslintConfig() {
  // install prettier eslint config
  await executeCmd(COMMANDS.install.eslint.config.prettier);
  await executeCmd(COMMANDS.install.eslint.plugin.prettier);
}

/**
 * Install prettier and setup config
 */
async function prettierSetup(hasReact) {
  try {
    // install prettier
    await executeCmd(COMMANDS.install.prettier);

    // check if user already has created .prettierrc
    const prettierrcFilePath = path.resolve(`${PROJECT_ROOT}`, PRETTIERRC);

    // get the prettier config file
    const prettierrc = hasReact ? `${PRETTIERRC}_react` : `${PRETTIERRC}_base`;
    const prettierConfigFile = path.resolve(
      `${PRETTIER_CONFIG_FOLDER}`,
      prettierrc,
    );

    // modify permissions and copy/overwrite file
    await executeCmd(`chmod -R 755 ${prettierConfigFile}`);
    fs.copyFileSync(prettierConfigFile, prettierrcFilePath);

    // check if user already has created .prettierignore
    const prettierignoreFilePath = path.resolve(
      `${PROJECT_ROOT}`,
      PRETTIERIGNORE,
    );

    const prettierignoreExists = fs.existsSync(prettierignoreFilePath);

    if (!prettierignoreExists) {
      const filename = PRETTIERIGNORE;
      const file = path.resolve(`${PRETTIER_CONFIG_FOLDER}`, filename);

      // give read and write access to the file
      await executeCmd(`chmod -R 755 ${file}`);

      fs.copyFileSync(file, prettierignoreFilePath);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  prettierEslintConfig,
  prettierSetup,
};
