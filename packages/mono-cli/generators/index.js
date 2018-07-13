/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

module.exports = (plop) => {
  plop.setGenerator('react-component', require('./react-component')(plop));
  plop.setGenerator('react-container', require('./react-container')(plop));
  plop.setGenerator('package', require('./package')(plop));
  plop.setGenerator('project', require('./project')(plop));
};
