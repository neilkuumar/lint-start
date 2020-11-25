# Lint Start

## The extremely opinionated linting and formatting quick start tool

There are plenty of great bootstrap projects out there, however, sometimes you have started a project that started off as a quick hack and evolved into something more or have joined an existing project without linting/prettier setup.

The idea here is a one time command that you can run to setup linting and prettier on your current project.

All you need to do is run the following from the root directory of your project! (This will be where your `package.json` is)

```properties
npx lint-start
```

### At the moment this only supports Node or React projects

## What this will set up

- eslint config: `airbnb` for React or eslint config: `airbnb-base` for Node
- prettier and prettier eslint config
- eslint config for jest
- `.eslintrc` pre-configured
- `.prettierrc` pre-configured
- `.prettierignore` pre-configured

This will come with some eslint/prettier rules out of the box but you can configure and customise them as normal.

## Prerequisites

- The project must be using git - this is so that you can easily roll back any unwanted changes.
- The project must have a `package.json`.
- It is recommended to remove any existing `eslint` or `prettier` config. The tool will attempt to merge existing `eslint` config rules, however, this feature may be removed in future if it proves troublesome.

### Contributing

- Feel free to raise a bug or a PR with any fixes/suggestions!
