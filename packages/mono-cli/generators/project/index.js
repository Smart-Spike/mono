/**
 * project/index.js
 *
 * Exports the project generator
 */

const path = require('path');
const config = require(path.join(process.env.MONO_ROOT, 'package.json')).monoCliConfig || {};
const projects = config.projects || [];
const projectExists = require('../utils/projectExists');

module.exports = (plop) => {
  const dashCase = plop.getHelper('dashCase');
  plop.setActionType('clone-project', require('./actions/cloneProject'));
  plop.setActionType('modify-pkg-json', require('./actions/modifyPkgJson'));

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
      type: 'clone-project',
      abortOnFail: true
    }, {
      type: 'modify-pkg-json',
      abortOnFail: false,
      data: { root: process.env.MONO_ROOT }
    }]
  };
};
