const childProcess = require('child_process');
const util = require('util');
const ora = require('ora');
const fs = require('fs');

jest.mock('util');
jest.mock('child_process');
jest.mock('ora');
jest.mock('fs');

jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
childProcess.exec.mockImplementation(() => ({ stdout: 'stdout' }));

const mockReactPackageJson = require('./__mocks__/mock_react_package.json');
const mockPackageJson = require('./__mocks__/mock_package.json');

const chalk = require('./chalk_helper');
const { COMMANDS } = require('./constants');
const helpers = require('./helpers');

describe('executeCmd', () => {
  it('should handle a successful command', async () => {
    const cmd = 'execute order 66';
    const output = await helpers.executeCmd(cmd);
    expect(childProcess.exec.mock.calls[0][0]).toBe(cmd);
    expect(output).toBe('stdout');
  });

  it('should handle a failed command', async () => {
    const cmd = 'execute order 66';
    const expectedError = 'NEVER!';
    childProcess.exec.mockImplementationOnce(() => {
      throw new Error(expectedError);
    });

    try {
      await helpers.executeCmd(cmd);
    } catch (error) {
      expect(childProcess.exec.mock.calls[0][0]).toBe(cmd);
      expect(error.message).toBe(expectedError);
    }
  });
});

describe('isGitRepo()', () => {
  it('should execute the correct commands', async () => {
    await helpers.isGitRepo();
    expect(childProcess.exec.mock.calls[0][0]).toBe(COMMANDS.isGitRepo);
  });
});

describe('runAction()', () => {
  const succeed = jest.fn();
  const fail = jest.fn();

  beforeEach(() => {
    ora.mockImplementation(() => ({
      start: jest.fn(() => ({
        stop: jest.fn(),
        succeed,
        fail,
      })),
    }));
  });

  it('should handle a successful action', async () => {
    const action = jest.fn();
    const text = 'Success!';

    await helpers.runAction({ action, text });

    expect(ora).toHaveBeenCalledWith(chalk.action(text));
    expect(action).toHaveBeenCalledTimes(1);
    expect(succeed).toHaveBeenCalled();
  });

  it('should handle a failed action', async () => {
    const action = jest.fn(() => {
      throw new Error();
    });
    const text = 'Error!';

    try {
      await helpers.runAction({ action, text });
    } catch (error) {
      expect(ora).toHaveBeenCalledWith(chalk.action(text));
      expect(action).toHaveBeenCalledTimes(1);
      expect(fail).toHaveBeenCalledWith();
    }
  });
});

describe('doesProjectHaveReact()', () => {
  it('should throw an error if no package.json exists', () => {
    fs.existsSync.mockImplementation(() => false);

    try {
      helpers.doesProjectHaveReact();
    } catch (error) {
      expect(error.message).toBe(chalk.error('No package.json detected!'));
    }
  });

  it('should return turn if detects react', () => {
    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation(() =>
      JSON.stringify(mockReactPackageJson),
    );

    const hasReact = helpers.doesProjectHaveReact();

    expect(hasReact).toBe(true);
  });

  it('should return false if react not found', () => {
    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation(() => JSON.stringify(mockPackageJson));

    const hasReact = helpers.doesProjectHaveReact();

    expect(hasReact).toBe(false);
  });
});
