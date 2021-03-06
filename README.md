# Lint Start

## The extremely opinionated linting and formatting quick start tool

There are plenty of great bootstrap projects out there, however, sometimes you have started a project that started off as a quick hack and evolved into something more or have joined an existing project without linting/prettier setup.

The idea here is a one time command that you can run to setup linting and prettier on your current project.

All you need to do is run the following from the root directory of your project! (This will be where your `package.json` is)

```properties
npx lint-start
```

### If using VS Code

It is recommended to run `Developer: Reload Window` to ensure the new config is picked up by the ide (cmd+shift+p then type `Developer: Reload Window`)

### What is npx?

`npx` installs and runs packages from an npm registry, making it really easy to use CLI tools hosted on a registry [you can find out more here].

[you can find out more here]: https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b

### At the moment this only supports Node or React projects

## What this will set up

- eslint config: `airbnb` for React or eslint config: `airbnb-base` for Node
- prettier and prettier eslint config
- eslint config for jest
- `.eslintrc` pre-configured
- `.prettierrc` pre-configured
- `.prettierignore` pre-configured
- It will add the following dependencies:

```properties
babel-eslint
prettier
eslint-plugin-jest
eslint-plugin-prettier
eslint-config-airbnb/eslint-config-airbnb-base
eslint-config-prettier
```

This will come with some eslint/prettier rules out of the box but you can configure and customise them as normal.

## Prerequisites

- The project must be using git - this is so that you can easily roll back any unwanted changes.
- The project must have a `package.json`.
- It is recommended to remove any existing `eslint` or `prettier` config. The tool will attempt to merge existing `eslint` config rules, however, this feature may be removed in future if it proves troublesome.

You can can set up `git` with:

```properties
git init
```

You can create a `package.json` with:

```properties
npm init
```

## Uninstalling/Rolling back

```properties
npx lint-start --uninstall
```

- This will remove any dependencies added by this library.
- This essentially runs
  `npm uninstall babel-eslint prettier eslint-plugin-jest eslint-plugin-prettier eslint-config-airbnb eslint-config-airbnb-base eslint-config-prettier`
- Then it will delete the following files: `.eslintrc`, `.prettierrc` and `.prettierignore`.

### Note: this is why the library will not run without git set up, so that you can easily undo any accidental changes

### Contributing

- Feel free to raise a bug or a PR with any fixes/suggestions!
