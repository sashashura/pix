// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon } = require('../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { _forTestOnly } = require('../../../lib/domain/events');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildEvent... Remove this comment to see the full error message
function buildEventDispatcherAndHandlersForTest() {
  const handlerStubs = {};
  Object.keys(_forTestOnly.handlers).forEach((h) => {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    handlerStubs[h] = sinon.stub();
  });

  return {
    handlerStubs,
    eventDispatcher: _forTestOnly.buildEventDispatcher(handlerStubs),
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildEventDispatcherAndHandlersForTest;
