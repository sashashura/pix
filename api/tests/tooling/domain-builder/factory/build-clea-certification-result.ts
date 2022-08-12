// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationResult = require('./../../../../lib/domain/models/CleaCertificationResult');

const buildCleaCertificationResult = function ({ status = CleaCertificationResult.cleaStatuses.ACQUIRED } = {}) {
  return new CleaCertificationResult({
    status,
  });
};

buildCleaCertificationResult.acquired = function () {
  return new CleaCertificationResult({
    status: CleaCertificationResult.cleaStatuses.ACQUIRED,
  });
};

buildCleaCertificationResult.rejected = function () {
  return new CleaCertificationResult({
    status: CleaCertificationResult.cleaStatuses.REJECTED,
  });
};

buildCleaCertificationResult.notTaken = function () {
  return new CleaCertificationResult({
    status: CleaCertificationResult.cleaStatuses.NOT_TAKEN,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCleaCertificationResult;
