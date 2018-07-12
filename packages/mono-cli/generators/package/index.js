/**
 * package/index.js
 *
 * Exports the package generator
 */

const path = require('path');
const glob = require('glob');
const packageExists = require('../utils/packageExists');
const config = require(path.join(process.env.MONO_ROOT, 'package.json')).monoCliConfig || {};
const scopes = config.scopes || [];

module.exports = (plop) => {
  const dashCase = plop.getHelper('dashCase');
  let selectedScope;
  return {
    description: 'Generates a new npm module in `/packages`',
    prompts: [{
      type: 'list',
      name: 'type',
      message: 'Select the type of package',
      default: 'Utility Library',
      choices: () => [{
        name: 'Utility Library (Typescript)',
        value: 'utility-library'
      }, {
        name: 'React Component Library (Typescript)',
        value: 'component-library'
      }]
    }, {
      type: 'list',
      name: 'scope',
      message: 'Select the package namespace scope',
      choices: scopes,
      default: scopes[0]
    }, {
      type: 'input',
      name: 'name',
      // hacky workaround to get current scope into suffix
      when: (answers) => (selectedScope = answers.scope, true),
      suffix: { valueOf: () => ` ${selectedScope}/` },
      message: 'Package name',
      filter: dashCase,
      validate: (value) => {
        if ((/.+/).test(value)) {
          return packageExists(value) ? `A package called ${value} exists already` : true
        }
        return 'Name is a required field'
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'Package description'
    }],
    actions: (data) => {
      const type = data.type;
      const tmplDir = path.join(__dirname, type);
      const templateFiles = glob.sync(`${tmplDir}/**/*.hbs`, { dot: true });
      return templateFiles.map(templateFile => {
        const file = path.relative(tmplDir, templateFile).replace(/\.hbs$/, '');
        return {
          type: 'add',
          path: path.join(process.env.MONO_ROOT, 'packages/{{name}}', file),
          templateFile: templateFile
        };
      });

      return actions;
    }
  };
};
