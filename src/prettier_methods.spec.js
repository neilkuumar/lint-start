const path = require('path');
const fs = require('fs');
const {
  COMMANDS,
  PRETTIER_CONFIG_FOLDER,
  PRETTIERIGNORE,
  PRETTIERRC,
  PROJECT_ROOT,
} = require('./constants');
const helpers = require('./helpers');

jest.spyOn(helpers, 'executeCmd').mockImplementation(() => jest.fn());
const methods = require('./prettier_methods');

const prettierrcFilePath = path.resolve(`${PROJECT_ROOT}`, PRETTIERRC);
const prettierignoreFilePath = path.resolve(`${PROJECT_ROOT}`, PRETTIERIGNORE);

describe('prettierEslintConfig()', () => {
  it('should execute the correct commands', async () => {
    await methods.prettierEslintConfig();

    const commands = helpers.executeCmd.mock.calls.map((calls) => calls[0]);
    expect(commands).toEqual([
      COMMANDS.install.eslint.config.prettier,
      COMMANDS.install.eslint.plugin.prettier,
    ]);
  });
});

describe('prettierSetup()', () => {
  it('should execute the correct commands', async () => {
    const copyFileSync = jest.fn();
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    jest.spyOn(fs, 'copyFileSync').mockImplementation(copyFileSync);

    const hasReact = false;
    const prettierrc = `${PRETTIERRC}_base`;

    const prettierignore = path.resolve(
      `${PRETTIER_CONFIG_FOLDER}`,
      PRETTIERIGNORE,
    );

    const prettierConfigFile = path.resolve(
      `${PRETTIER_CONFIG_FOLDER}`,
      prettierrc,
    );

    await methods.prettierSetup(hasReact);

    const commands = helpers.executeCmd.mock.calls.map((calls) => calls[0]);

    expect(commands).toEqual([
      COMMANDS.install.prettier,
      `chmod -R 755 ${prettierConfigFile}`,
      `chmod -R 755 ${prettierignore}`,
    ]);

    expect(copyFileSync).toHaveBeenCalledTimes(2);

    const prettierrcCopy = copyFileSync.mock.calls[0];
    const prettierignoreCopy = copyFileSync.mock.calls[1];
    expect(prettierrcCopy).toEqual([prettierConfigFile, prettierrcFilePath]);
    expect(prettierignoreCopy).toEqual([
      prettierignore,
      prettierignoreFilePath,
    ]);
  });

  it('should execute the correct commands for react', async () => {
    const copyFileSync = jest.fn();
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    jest.spyOn(fs, 'copyFileSync').mockImplementation(copyFileSync);

    const hasReact = true;
    const prettierrc = `${PRETTIERRC}_react`;

    const prettierignore = path.resolve(
      `${PRETTIER_CONFIG_FOLDER}`,
      PRETTIERIGNORE,
    );

    const prettierConfigFile = path.resolve(
      `${PRETTIER_CONFIG_FOLDER}`,
      prettierrc,
    );

    await methods.prettierSetup(hasReact);

    const commands = helpers.executeCmd.mock.calls.map((calls) => calls[0]);

    expect(commands).toEqual([
      COMMANDS.install.prettier,
      `chmod -R 755 ${prettierConfigFile}`,
      `chmod -R 755 ${prettierignore}`,
    ]);

    expect(copyFileSync).toHaveBeenCalledTimes(2);

    const prettierrcCopy = copyFileSync.mock.calls[0];
    const prettierignoreCopy = copyFileSync.mock.calls[1];
    expect(prettierrcCopy).toEqual([prettierConfigFile, prettierrcFilePath]);
    expect(prettierignoreCopy).toEqual([
      prettierignore,
      prettierignoreFilePath,
    ]);
  });

  it('should execute the correct commands if a prettierignore already exists', async () => {
    const copyFileSync = jest.fn();
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'copyFileSync').mockImplementation(copyFileSync);

    const hasReact = true;
    const prettierrc = `${PRETTIERRC}_react`;

    const prettierConfigFile = path.resolve(
      `${PRETTIER_CONFIG_FOLDER}`,
      prettierrc,
    );

    await methods.prettierSetup(hasReact);

    const commands = helpers.executeCmd.mock.calls.map((calls) => calls[0]);

    expect(commands).toEqual([
      COMMANDS.install.prettier,
      `chmod -R 755 ${prettierConfigFile}`,
    ]);

    expect(copyFileSync).toHaveBeenCalledTimes(1);

    const prettierrcCopy = copyFileSync.mock.calls[0];
    expect(prettierrcCopy).toEqual([prettierConfigFile, prettierrcFilePath]);
  });
});
