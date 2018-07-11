/**
 * project/index.js
 *
 * Exports the project generator
 */

const path = require('path');
const root = path.resolve(__dirname, '../../../');
const shell = require('shelljs');
const ora = require('ora');
const config = require(path.join(root, 'package.json')).monoCliConfig || {};
const projects = config.projects || [];
const projectExists = require('../utils/projectExists');

module.exports = (plop) => {
  const dashCase = plop.getHelper('dashCase');
  plop.setActionType('clone-project', function (answers, config, plop) {
    return new Promise((resolve, reject) => {
      const spinner = ora(`Cloning ${answers.type.repository}\n`).start();
      const clone = shell.exec(`git clone ${answers.type.repository} projects/${answers.name} --depth=1 --progress --verbose`, (code, _stdout, _stderr) => {
        if (code !== 0) {
          spinner.fail();
          return reject(err);
        }
        spinner.succeed(`Cloned: ${answers.type.repository}, done.`);
        return resolve(`Created new ${answers.type.name} project in \`projects/${answers.name}\``);
      });

      clone.stderr.on('data', (data) => spinner.text = data.toString('utf8'));
    });
  });

  return {
    description: 'Generates a new project in `/projects`',
    prompts: [{
      type: 'list',
      name: 'type',
      message: 'Select a source project',
      default: projects[0],
      choices: () => projects.map((project) => ({
        name: project.description,
        short: project.name,
        value: {
          repository: project.repository,
          name: project.name
        }
      }))
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
      type: 'clone-project'
    }, {
      type: 'modify',
      path: `${root}/projects/{{name}}/package.json`,
      pattern: /"name": ".+"/gi,
      template: '"name": "{{name}}"'
    }, {
      type: 'modify',
      path: `${root}/projects/{{name}}/package.json`,
      pattern: /"description": ".+"/gi,
      template: '"description": "{{description}}"'
    }, {
      type: 'modify',
      path: `${root}/projects/{{name}}/package.json`,
      pattern: /"version": ".+"/gi,
      template: '"version": "0.0.1"'
    }]
  };
};
