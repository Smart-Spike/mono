/**
 * project/index.js
 *
 * Exports the project generator
 */

const path = require('path');
const git = require('simple-git');
const ora = require('ora');
const projectExists = require('../utils/projectExists');

module.exports = (plop) => {
  const dashCase = plop.getHelper('dashCase');
  plop.setActionType('generateBoilerplateProject', function (answers, config, plop) {
    return new Promise((resolve, reject) => {
      const spinner = ora(`Cloning ${answers.type.repository}`).start();
      git()
        .outputHandler((command, stdout, stderr) => {
          stderr.on('data', function (data) {
            spinner.text = data.toString('utf8');
          })
        })
        .clone(answers.type.repository, `projects/${answers.name}`, ['--depth=1', '--progress', '--verbose'], (err, res) => {
          if (err) {
            spinner.fail();
            reject(err);
          }

          spinner.succeed(`Cloned: ${answers.type.repository}, done.`);
          resolve(`Created new ${answers.type.name} project in \`projects/${answers.name}\``);
        });
    });
  });
  return {
    description: 'Generates a new project in `/projects`',
    prompts: [{
      type: 'list',
      name: 'type',
      message: 'Select a source project',
      default: 'React Boilerplate (TypeScript)',
      choices: () => [{
        name: 'React Boilerplate (TypeScript)',
        value: {
          repository: 'https://github.com/react-boilerplate/react-boilerplate.git',
          name: 'react-boilerplate'
        },
        short: 'react-boilerplate'
      }]
    }, {
      type: 'input',
      name: 'name',
      message: 'Package name',
      filter: dashCase,
      validate: (value) => {
        if ((/.+/).test(value)) {
          return projectExists(value) ? `A project called \`${value}\` exists already` : true
        }
        return 'Name is a required field'
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'Package description'
    }],
    actions: [{
      type: 'generateBoilerplateProject'
    }, {
      type: 'modify',
      path:
    }]
  };
};
