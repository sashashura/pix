// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesLotManagement = require('../../../domain/read-models/OrganizationPlacesLotManagement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');

async function findByOrganizationId(organizationId: $TSFixMe) {
  const results = await knex('organization-places')
    .select(
      'organization-places.id AS id',
      'count',
      'activationDate',
      'expirationDate',
      'reference',
      'category',
      'users.firstName AS creatorFirstName',
      'users.lastName AS creatorLastName'
    )
    .join('users', 'users.id', 'createdBy')
    .where({ organizationId })
    .orderBy('activationDate', 'desc')
    .orderBy('expirationDate', 'desc')
    .orderBy('organization-places.createdAt', 'desc');

  return results.map((result: $TSFixMe) => {
    return new OrganizationPlacesLotManagement(result);
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
async function get(id: $TSFixMe) {
  const result = await knex('organization-places')
    .select(
      'organization-places.id AS id',
      'count',
      'activationDate',
      'expirationDate',
      'reference',
      'category',
      'users.firstName AS creatorFirstName',
      'users.lastName AS creatorLastName'
    )
    .join('users', 'users.id', 'createdBy')
    .where({ 'organization-places.id': id })
    .first();

  if (!result) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
    throw new NotFoundError();
  }

  return new OrganizationPlacesLotManagement(result);
}

async function create(places: $TSFixMe) {
  const [{ id }] = await knex('organization-places').insert(places).returning('id');
  return id;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByOrganizationId,
  get,
  create,
};
