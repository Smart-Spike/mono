const shell = require('shelljs');

module.exports = function (answers, config, _plop) {
  const path = `${config.data.root}/projects/${answers.name}/package.json`;
  const version = '0.0.1';
  const actions = [
    shell.sed('-i', /("name":\s?").+(",?)/g, `$1${answers.name}$2`, path),
    shell.sed('-i', /("description":\s?").+(",?)/g, `$1${answers.description}$2`, path),
    shell.sed('-i', /("version":\s?").+(",?)/g, `$1${version}$2`, path)
  ];
  actions.forEach(action => {
    if (action.stderr) { throw new Error(action.stderr); }
  });
  return "Updated package.json `name`, `description` and `version`";
};
