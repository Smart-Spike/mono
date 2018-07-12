const shell = require('shelljs');
const ora = require('ora');

module.exports = function (answers, config, plop) {
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
};
