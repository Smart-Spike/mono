/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

module.exports = (plop) => {
  plop.setGenerator('project', require('./project')(plop));
};
