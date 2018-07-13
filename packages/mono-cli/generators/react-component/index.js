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
const pkgJson = require(path.join(process.env.MONO_ROOT, 'package.json'));
const pkgRoots = pkgJson.workspaces.packages;

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
          return glob(`{${pkgRoots.join(',')}}`, { cwd: process.env.MONO_ROOT })
            .then(results => {
              return input
                ? fuzzy.filter(input, results).map(match => match.string)
                : results;
            });
        }
      },
      {
        type: 'autocomplete',
        name: 'targetPath',
        message: 'Where would you like to create your component?',
        suggestOnly: true,
        source: (answers, input) => {
          return glob('**/', {
            cwd: path.join(process.env.MONO_ROOT, answers.targetPackage),
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
            return fs.existsSync(path.join(process.env.MONO_ROOT, answers.targetPackage, answers.targetPath, value))
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
          path: `${path.join(process.env.MONO_ROOT, data.targetPackage, data.targetPath)}/{{properCase name}}/index.tsx`,
          templateFile: componentTemplate,
          abortOnFail: true,
        },
        {
          type: 'add',
          path: `${path.join(process.env.MONO_ROOT, data.targetPackage, data.targetPath)}/{{properCase name}}/tests/index.test.tsx`,
          templateFile: './react-component/test.tsx.hbs',
          abortOnFail: true,
        },
      ];

      // If they want a i18n messages file
      if (data.wantMessages) {
        actions.push({
          type: 'add',
          path: `${path.join(process.env.MONO_ROOT, data.targetPackage, data.targetPath)}/{{properCase name}}/messages.ts`,
          templateFile: './react-component/messages.ts.hbs',
          abortOnFail: true,
        });
      }

      // If want Loadable.ts to load the component asynchronously
      if (data.wantLoadable) {
        actions.push({
          type: 'add',
          path: `${path.join(process.env.MONO_ROOT, data.targetPackage, data.targetPath)}/{{properCase name}}/Loadable.ts`,
          templateFile: './react-component/loadable.ts.hbs',
          abortOnFail: true,
        });
      }

      return actions;
    }
  };
};
