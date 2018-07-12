/**
 * packageExists
 *
 * Check whether the given package exist in the packages directory
 */

const fs = require('fs');
const path = require('path');
const packages = fs.readdirSync(path.join(process.env.MONO_ROOT, 'packages'));

function packageExists(pkg) {
  return packages.indexOf(pkg) >= 0;
}

module.exports = packageExists;
