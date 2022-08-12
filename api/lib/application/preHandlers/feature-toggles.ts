// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../application/http-errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async checkIfSSOAccountReconciliationIsEnabled() {
    if (!config.featureToggles.isSsoAccountReconciliationEnabled) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError('Cette route est désactivée');
    }
    return true;
  },
};
