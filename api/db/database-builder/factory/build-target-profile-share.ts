// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTargetProfileShare({
  id = databaseBuffer.getNextId(),
  targetProfileId,
  organizationId,
  createdAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  targetProfileId = _.isUndefined(targetProfileId) ? buildTargetProfile().id : targetProfileId;
  organizationId = _.isUndefined(organizationId) ? buildOrganization().id : organizationId;

  const values = {
    id,
    targetProfileId,
    organizationId,
    createdAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'target-profile-shares',
    values,
  });
};
