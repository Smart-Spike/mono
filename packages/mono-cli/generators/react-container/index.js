/**
 * Container Generator
 */

const path = require('path');
const util = require('util');
const fs = require('fs');
const glob = util.promisify(require('glob'));
const fuzzy = require('fuzzy');
const generateSuggestedTargetPath = require('../utils/generateSuggestedTargetPath');

const rootDir = process.env.MONO_ROOT;
const pkgJson = require(path.join(rootDir, 'package.json'));
const pkgRoots = pkgJson.workspaces.packages;

const getTargetPathFromAnswers = (answers) => {
  return answers.useSuggestedTargetPath
    ? generateSuggestedTargetPath(answers.targetPackage, 'containers')
    : path.join(rootDir, answers.targetPackage, answers.targetPath);
};

module.exports = (plop) => ({
  description: 'Add a container component',
  prompts: [
    {
      type: 'autocomplete',
      name: 'targetPackage',
      message: 'Select a package or project for your container (fuzzy matching)',
      source: (answers, input) => {
        return glob(`{${pkgRoots.join(',')}}`, { cwd: rootDir })
          .then(results => {
            return input
              ? fuzzy.filter(input, results).map(match => match.string)
              : results;
          });
      }
    },
    {
      type: 'confirm',
      name: 'useSuggestedTargetPath',
      prefix: 'Create in suggested target directory',
      message: (answers) => generateSuggestedTargetPath(answers.targetPackage, 'containers'),
      when: (answers) => Boolean(generateSuggestedTargetPath(answers.targetPackage, 'containers')),
      default: true,
    },
    {
      type: 'autocomplete',
      name: 'targetPath',
      message: 'Where would you like to create your container?',
      when: answers => !answers.useSuggestedTargetPath,
      source: (answers, input) => {
        return glob('**/', {
          cwd: path.join(rootDir, answers.targetPackage),
          ignore: ['node_modules/**', 'coverage/**', 'docs/**', 'dist/**', 'build/**', 'internals/**', 'server/**']
        }).then(results => {
          return input
            ? fuzzy.filter(input, results).map(match => match.string)
            : results;
        });
      }
    },
    {
      type: 'list',
      name: 'type',
      message: 'Select the base component type:',
      default: 'Stateless Function',
      choices: () => [
        'Stateless Function',
        'React.Component',
      ],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      validate: (value, answers) => {
        if (/.+/.test(value)) {
          const targetPath = getTargetPathFromAnswers(answers);
          return fs.existsSync(path.join(targetPath, value))
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantHeaders',
      default: false,
      message: 'Do you want headers?',
    },
    {
      type: 'confirm',
      name: 'wantActionsAndReducer',
      default: true,
      message:
        'Do you want an actions/constants/selectors/reducer tuple for this container?',
    },
    {
      type: 'confirm',
      name: 'wantSaga',
      default: true,
      message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: true,
      message: 'Do you want to load resources asynchronously?',
    },
  ],
  actions: data => {
    // Generate index.tsx and index.test.tsx
    var componentTemplate; // eslint-disable-line no-var

    switch (data.type) {
      case 'Stateless Function': {
        componentTemplate = './react-container/stateless.tsx.hbs';
        break;
      }
      default: {
        componentTemplate = './react-container/class.tsx.hbs';
      }
    }

    const actions = [
      {
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/index.tsx`,
        templateFile: componentTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/tests/index.test.tsx`,
        templateFile: './react-container/test.tsx.hbs',
        abortOnFail: true,
      },
    ];

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/messages.ts`,
        templateFile: './react-container/messages.ts.hbs',
        abortOnFail: true,
      });
    }

    // If they want actions and a reducer, generate actions.ts, constants.ts,
    // reducer.ts and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/actions.ts`,
        templateFile: './react-container/actions.ts.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/tests/actions.test.ts`,
        templateFile: './react-container/actions.test.ts.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/constants.ts`,
        templateFile: './react-container/constants.ts.hbs',
        abortOnFail: true,
      });

      // Selectors
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/selectors.ts`,
        templateFile: './react-container/selectors.ts.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/tests/selectors.test.ts`,
        templateFile: './react-container/selectors.test.ts.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/reducer.ts`,
        templateFile: './react-container/reducer.ts.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/tests/reducer.test.ts`,
        templateFile: './react-container/reducer.test.ts.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/saga.ts`,
        templateFile: './react-container/saga.ts.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/tests/saga.test.ts`,
        templateFile: './react-container/saga.test.ts.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/Loadable.ts`,
        templateFile: './react-component/loadable.ts.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
});
