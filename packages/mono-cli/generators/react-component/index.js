/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

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
    ? generateSuggestedTargetPath(answers.targetPackage, 'components')
    : path.join(rootDir, answers.targetPackage, answers.targetPath);
};

module.exports = (plop) => {
  plop.inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
  return {
    description: 'Add an unconnected component',
    prompts: [
      {
        type: 'autocomplete',
        name: 'targetPackage',
        message: 'Select a package or project for your component (fuzzy matching)',
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
        message: (answers) => generateSuggestedTargetPath(answers.targetPackage, 'components'),
        when: (answers) => Boolean(generateSuggestedTargetPath(answers.targetPackage, 'components')),
        default: true,
      },
      {
        type: 'autocomplete',
        name: 'targetPath',
        message: 'Where would you like to create your component?',
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
        message: 'Select the type of component',
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
        name: 'wantMessages',
        default: true,
        message: 'Do you want i18n messages (i.e. will this component use text)?',
      },
      {
        type: 'confirm',
        name: 'wantLoadable',
        default: false,
        message: 'Do you want to load the component asynchronously?',
      },
    ],
    actions: data => {
      // Generate index.tsx and index.test.tsx
      let componentTemplate;

      switch (data.type) {
        case 'Stateless Function': {
          componentTemplate = './react-component/stateless.tsx.hbs';
          break;
        }
        default: {
          componentTemplate = './react-component/class.tsx.hbs';
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
          templateFile: './react-component/test.tsx.hbs',
          abortOnFail: true,
        },
      ];

      // If they want a i18n messages file
      if (data.wantMessages) {
        actions.push({
          type: 'add',
          path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/messages.ts`,
          templateFile: './react-component/messages.ts.hbs',
          abortOnFail: true,
        });
      }

      // If want Loadable.ts to load the component asynchronously
      if (data.wantLoadable) {
        actions.push({
          type: 'add',
          path: `${getTargetPathFromAnswers(data)}/{{properCase name}}/Loadable.ts`,
          templateFile: './react-component/loadable.ts.hbs',
          abortOnFail: true,
        });
      }

      return actions;
    }
  };
};
