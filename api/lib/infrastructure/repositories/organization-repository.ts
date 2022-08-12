// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganization = require('../orm-models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGE_SIZE = 10;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGE_NUMBER = 1;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(rawOrganization: $TSFixMe) {
  const organization = new Organization({
    id: rawOrganization.id,
    name: rawOrganization.name,
    type: rawOrganization.type,
    logoUrl: rawOrganization.logoUrl,
    externalId: rawOrganization.externalId,
    provinceCode: rawOrganization.provinceCode,
    isManagingStudents: Boolean(rawOrganization.isManagingStudents),
    credit: rawOrganization.credit,
    email: rawOrganization.email,
    documentationUrl: rawOrganization.documentationUrl,
    createdBy: rawOrganization.createdBy,
    showNPS: rawOrganization.showNPS,
    formNPSUrl: rawOrganization.formNPSUrl,
    showSkills: rawOrganization.showSkills,
    archivedAt: rawOrganization.archivedAt,
  });

  organization.targetProfileShares = rawOrganization.targetProfileShares || [];
  organization.tags = rawOrganization.tags || [];

  return organization;
}

function _setSearchFiltersForQueryBuilder(filter: $TSFixMe, qb: $TSFixMe) {
  const { id, name, type, externalId } = filter;
  if (id) {
    qb.where('organizations.id', id);
  }
  if (name) {
    qb.whereRaw('LOWER("name") LIKE ?', `%${name.toLowerCase()}%`);
  }
  if (type) {
    qb.whereRaw('LOWER("type") LIKE ?', `%${type.toLowerCase()}%`);
  }
  if (externalId) {
    qb.whereRaw('LOWER("externalId") LIKE ?', `%${externalId.toLowerCase()}%`);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create(organization: $TSFixMe) {
    const organizationRawData = _.pick(organization, [
      'name',
      'type',
      'logoUrl',
      'externalId',
      'provinceCode',
      'email',
      'isManagingStudents',
      'createdBy',
      'documentationUrl',
    ]);

    return knex('organizations')
      .insert(organizationRawData)
      .returning('*')
      // @ts-expect-error TS(7031): Binding element 'organization' implicitly has an '... Remove this comment to see the full error message
      .then(([organization]) => _toDomain(organization));
  },

  async batchCreateProOrganizations(organizations: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    const organizationsRawData = organizations.map((organization: $TSFixMe) => _.pick(organization, [
      'name',
      'type',
      'logoUrl',
      'externalId',
      'provinceCode',
      'email',
      'isManagingStudents',
      'credit',
      'createdBy',
      'documentationUrl',
    ])
    );
    return Bookshelf.knex
      .batchInsert('organizations', organizationsRawData)
      .transacting(domainTransaction.knexTransaction)
      .returning(['id', 'externalId', 'email', 'name']);
  },

  update(organization: $TSFixMe) {
    const organizationRawData = _.pick(organization, [
      'name',
      'type',
      'logoUrl',
      'externalId',
      'provinceCode',
      'isManagingStudents',
      'email',
      'credit',
      'documentationUrl',
      'showSkills',
    ]);

    return new BookshelfOrganization({ id: organization.id })
      .save(organizationRawData, { patch: true })
      .then((model: $TSFixMe) => model.refresh({ withRelated: 'tags' }))
      .then((model: $TSFixMe) => model.toJSON())
      .then(_toDomain);
  },

  get(id: $TSFixMe) {
    return BookshelfOrganization.where({ id })
      .fetch({
        withRelated: ['targetProfileShares.targetProfile', 'tags'],
      })
      .then((model: $TSFixMe) => model.toJSON())
      .then(_toDomain)
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfOrganization.NotFoundError) {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
          throw new NotFoundError(`Not found organization for ID ${id}`);
        }
        throw err;
      });
  },

  async getIdByCertificationCenterId(certificationCenterId: $TSFixMe) {
    const organizationIds = await knex
      .pluck('organizations.id')
      .from('organizations')
      .innerJoin('certification-centers', function(this: $TSFixMe) {
        this.on('certification-centers.externalId', 'organizations.externalId').andOn(
          'certification-centers.type',
          'organizations.type'
        );
      })
      .where('certification-centers.id', certificationCenterId);

    if (organizationIds.length !== 1)
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Not found organization for certification center id ${certificationCenterId}`);
    return organizationIds[0];
  },

  async getScoOrganizationByExternalId(externalId: $TSFixMe) {
    const organizationBookshelf = await BookshelfOrganization.query((qb: $TSFixMe) => qb.where({ type: Organization.types.SCO }).whereRaw('LOWER("externalId") = ?', externalId.toLowerCase())
    ).fetch({ require: false });

    if (organizationBookshelf) {
      return _toDomain(organizationBookshelf.toJSON());
    }
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Could not find organization for externalId ${externalId}.`);
  },

  findByExternalIdsFetchingIdsOnly(externalIds: $TSFixMe) {
    return BookshelfOrganization.where('externalId', 'in', externalIds)
      .fetchAll({ columns: ['id', 'externalId'] })
      .then((organizations: $TSFixMe) => organizations.models.map((model: $TSFixMe) => _toDomain(model.toJSON())));
  },

  findScoOrganizationsByUai({
    uai
  }: $TSFixMe) {
    return BookshelfOrganization.query((qb: $TSFixMe) => qb.where({ type: Organization.types.SCO }).whereRaw('LOWER("externalId") = ? ', `${uai.toLowerCase()}`)
    )
      .fetchAll({ columns: ['id', 'type', 'externalId', 'email', 'archivedAt'] })
      .then((organizations: $TSFixMe) => organizations.models.map((model: $TSFixMe) => _toDomain(model.toJSON())));
  },

  findPaginatedFiltered({
    filter,
    page
  }: $TSFixMe) {
    const pageSize = page.size ? page.size : DEFAULT_PAGE_SIZE;
    const pageNumber = page.number ? page.number : DEFAULT_PAGE_NUMBER;
    return BookshelfOrganization.query((qb: $TSFixMe) => _setSearchFiltersForQueryBuilder(filter, qb))
      .fetchPage({
        page: pageNumber,
        pageSize: pageSize,
      })
      .then(({
      models,
      pagination
    }: $TSFixMe) => {
        const organizations = bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganization, models);
        return { models: organizations, pagination };
      });
  },

  async findPaginatedFilteredByTargetProfile({
    targetProfileId,
    filter,
    page
  }: $TSFixMe) {
    const pageSize = page.size ? page.size : DEFAULT_PAGE_SIZE;
    const pageNumber = page.number ? page.number : DEFAULT_PAGE_NUMBER;
    const { models, pagination } = await BookshelfOrganization.query((qb: $TSFixMe) => {
      qb.where({ 'target-profile-shares.targetProfileId': targetProfileId });
      _setSearchFiltersForQueryBuilder(filter, qb);
      qb.innerJoin('target-profile-shares', 'organizations.id', 'target-profile-shares.organizationId');
    }).fetchPage({
      page: pageNumber,
      pageSize,
    });
    const organizations = bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganization, models);
    return { models: organizations, pagination };
  },
};
