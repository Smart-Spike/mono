const path = require('path');
const fs = require('fs');
const memoize = require('memoizee');

const rootDir = process.env.MONO_ROOT;

const generateSuggestedTargetPath = memoize((pkgDir, namespace) => {
  // try to guess a suitable target dir for the given namespace
  const suggestions = [
    path.join(rootDir, pkgDir, namespace),
    path.join(rootDir, pkgDir, 'src', namespace),
    path.join(rootDir, pkgDir, 'app', namespace)
  ];
  return suggestions.reduce((match, suggestion) => {
    if (Boolean(match)) return match;
    return fs.existsSync(suggestion) ? suggestion : void 0;
  }, void 0);
});

module.exports = generateSuggestedTargetPath;
