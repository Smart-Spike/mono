/**
 * projectExists
 *
 * Check whether the given project exists in the projects directory
 */

const fs = require('fs');
const path = require('path');
const packages = fs.readdirSync(path.join(process.env.MONO_ROOT, 'projects'));

function projectExists(pkg) {
  return packages.indexOf(pkg) >= 0;
}

module.exports = projectExists;
