// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganizationInvitation = require('../orm-models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../domain/models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(bookshelfInvitation: $TSFixMe) {
  if (bookshelfInvitation) {
    return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationInvitation, bookshelfInvitation);
  }
  return null;
}

function _checkNotFoundError(error: $TSFixMe, id: $TSFixMe) {
  if (error instanceof BookshelfOrganizationInvitation.NotFoundError) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Not found organization-invitation for ID ${id}`);
  }
  throw error;
}

function _checkNotFoundErrorWithCode({
  error,
  id,
  code
}: $TSFixMe) {
  if (error instanceof BookshelfOrganizationInvitation.NotFoundError) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Not found organization-invitation for ID ${id} and code ${code}`);
  }
  throw error;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create({
    organizationId,
    email,
    code,
    role
  }: $TSFixMe) {
    const status = OrganizationInvitation.StatusType.PENDING;
    return new BookshelfOrganizationInvitation({ organizationId, email, status, code, role }).save().then(_toDomain);
  },

  get(id: $TSFixMe) {
    return BookshelfOrganizationInvitation.where({ id })
      .fetch()
      .then(_toDomain)
      .catch((err: $TSFixMe) => _checkNotFoundError(err, id));
  },

  getByIdAndCode({
    id,
    code
  }: $TSFixMe) {
    return BookshelfOrganizationInvitation.where({ id, code })
      .fetch()
      .then(_toDomain)
      .catch((error: $TSFixMe) => _checkNotFoundErrorWithCode({ error, id, code }));
  },

  markAsAccepted(id: $TSFixMe) {
    const status = OrganizationInvitation.StatusType.ACCEPTED;

    return new BookshelfOrganizationInvitation({ id })
      .save({ status }, { patch: true, require: true })
      .then((model: $TSFixMe) => model.refresh())
      .then(_toDomain)
      .catch((err: $TSFixMe) => _checkNotFoundError(err, id));
  },

  async markAsCancelled({
    id
  }: $TSFixMe) {
    const [organizationInvitation] = await knex('organization-invitations')
      .where({ id })
      .update({
        status: OrganizationInvitation.StatusType.CANCELLED,
        updatedAt: new Date(),
      })
      .returning('*');

    if (!organizationInvitation) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Organization invitation of id ${id} is not found.`);
    }
    return new OrganizationInvitation(organizationInvitation);
  },

  findPendingByOrganizationId({
    organizationId
  }: $TSFixMe) {
    return BookshelfOrganizationInvitation.where({ organizationId, status: OrganizationInvitation.StatusType.PENDING })
      .orderBy('updatedAt', 'desc')
      .fetchAll()
      .then((results: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganizationInvitation, results));
  },

  findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email
  }: $TSFixMe) {
    return BookshelfOrganizationInvitation.query((qb: $TSFixMe) => qb
      .where({ organizationId, status: OrganizationInvitation.StatusType.PENDING })
      .whereRaw('LOWER("email") = ?', `${email.toLowerCase()}`)
    )
      .fetch({ require: false })
      .then(_toDomain);
  },

  async updateModificationDate(id: $TSFixMe) {
    const organizationInvitation = await knex('organization-invitations')
      .where({ id })
      .update({ updatedAt: new Date() })
      .returning('*')
      .then(_.first);

    if (!organizationInvitation) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Organization invitation of id ${id} is not found.`);
    }
    return new OrganizationInvitation(organizationInvitation);
  },
};
