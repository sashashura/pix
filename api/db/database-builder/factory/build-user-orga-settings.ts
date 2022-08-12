// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildUserOrgaSettings({
  id = databaseBuffer.getNextId(),
  currentOrganizationId,
  userId
}: $TSFixMe = {}) {
  userId = _.isUndefined(userId) ? buildUser().id : userId;
  currentOrganizationId = _.isUndefined(currentOrganizationId) ? buildOrganization().id : currentOrganizationId;

  const values = {
    id,
    currentOrganizationId,
    userId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'user-orga-settings',
    values,
  });
};
