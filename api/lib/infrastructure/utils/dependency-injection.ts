// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'injectDefa... Remove this comment to see the full error message
function injectDefaults(defaults: $TSFixMe, targetFn: $TSFixMe) {
  return (args: $TSFixMe) => targetFn(Object.assign(Object.create(defaults), args));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'injectDepe... Remove this comment to see the full error message
function injectDependencies(toBeInjected: $TSFixMe, dependencies: $TSFixMe) {
  return _.mapValues(toBeInjected, _.partial(injectDefaults, dependencies));
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { injectDependencies, injectDefaults };
