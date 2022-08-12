// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../lib/domain/models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildOrganizationInvitation({
  id = databaseBuffer.getNextId(),
  organizationId,
  email = 'some.mail@example.net',
  status = OrganizationInvitation.StatusType.PENDING,
  code = 'INVIABC123',
  role = null,
  updatedAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  organizationId = _.isUndefined(organizationId) ? buildOrganization().id : organizationId;
  email = email.toLowerCase();

  const values = {
    id,
    organizationId,
    email,
    status,
    code,
    role,
    createdAt: new Date(),
    updatedAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'organization-invitations',
    values,
  });
};
