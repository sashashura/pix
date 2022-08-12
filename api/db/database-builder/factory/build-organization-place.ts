// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');

const buildOrganizationPlace = function buildOrganizationPlace({
  id = databaseBuffer.getNextId(),
  organizationId,
  count = 7777,
  activationDate = new Date('2014-05-13'),
  expirationDate,
  reference = 'Godzilla',
  category = 'T0',
  createdBy,
  createdAt = new Date('1997-07-01')
}: $TSFixMe = {}) {
  organizationId = organizationId || buildOrganization().id;
  createdBy = createdBy || buildUser.withRole({ firstName: 'Gareth', lastName: 'Edwards' }).id;

  const values = {
    id,
    count,
    organizationId,
    activationDate,
    expirationDate,
    reference,
    category,
    createdBy,
    createdAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'organization-places',
    values,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildOrganizationPlace;
