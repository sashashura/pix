// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTag'.
const buildTag = require('./build-tag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildOrganizationTag({
  id = databaseBuffer.getNextId(),
  organizationId,
  tagId
}: $TSFixMe = {}) {
  tagId = _.isUndefined(tagId) ? buildTag().id : tagId;
  organizationId = _.isUndefined(organizationId) ? buildOrganization().id : organizationId;

  const values = {
    id,
    organizationId,
    tagId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'organization-tags',
    values,
  });
};
