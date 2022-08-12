// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesCapacity = require('../../domain/read-models/OrganizationPlacesCapacity');

async function findByOrganizationId(organizationId: $TSFixMe) {
  const now = new Date();
  const organizationPlacesLots = await knex('organization-places')
    .select('category', 'count')
    .where({ organizationId })
    .where('activationDate', '<', now)
    .where(function(this: $TSFixMe) {
      this.where('expirationDate', '>', now).orWhereNull('expirationDate');
    });

  return new OrganizationPlacesCapacity({ placesLots: organizationPlacesLots, organizationId });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByOrganizationId,
};
