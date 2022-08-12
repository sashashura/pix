// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCenter = require('./build-certification-center');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCenterMembership({
  id = databaseBuffer.getNextId(),
  userId,
  certificationCenterId,
  createdAt = new Date('2020-01-01'),
  disabledAt
}: $TSFixMe = {}) {
  userId = _.isUndefined(userId) ? buildUser().id : userId;
  certificationCenterId = _.isUndefined(certificationCenterId) ? buildCertificationCenter().id : certificationCenterId;

  const values = {
    id,
    userId,
    certificationCenterId,
    createdAt,
    disabledAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'certification-center-memberships',
    values,
  });
};
