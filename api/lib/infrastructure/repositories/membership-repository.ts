// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfM... Remove this comment to see the full error message
const BookshelfMembership = require('../orm-models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const { MembershipCreationError, MembershipUpdateError, NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGE_SIZE = 10;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGE_NUMBER = 1;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(bookshelfMembership: $TSFixMe) {
  const membership = new Membership(bookshelfMembership.toJSON());

  if (bookshelfMembership.relations.user) {
    membership.user = new User(bookshelfMembership.relations.user.toJSON());
  }

  if (bookshelfMembership.relations.organization) {
    membership.organization = new Organization(bookshelfMembership.relations.organization.toJSON());
  }

  return membership;
}

function _setSearchFiltersForQueryBuilder(filter: $TSFixMe, qb: $TSFixMe) {
  const { firstName, lastName, email, organizationRole } = filter;
  if (firstName) {
    qb.whereRaw('LOWER(users."firstName") LIKE ?', `%${firstName.toLowerCase()}%`);
  }
  if (lastName) {
    qb.whereRaw('LOWER(users."lastName") LIKE ?', `%${lastName.toLowerCase()}%`);
  }
  if (email) {
    qb.whereRaw('LOWER(users."email") LIKE ?', `%${email.toLowerCase()}%`);
  }
  if (organizationRole) {
    qb.where('memberships.organizationRole', organizationRole);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create(userId: $TSFixMe, organizationId: $TSFixMe, organizationRole: $TSFixMe) {
    return new BookshelfMembership({ userId, organizationId, organizationRole })
      .save()
      .then((bookshelfMembership: $TSFixMe) => bookshelfMembership.load(['user']))
      .then(_toDomain)
      .catch((err: $TSFixMe) => {
        if (bookshelfUtils.isUniqConstraintViolated(err)) {
          throw new MembershipCreationError(err.message);
        }
        throw err;
      });
  },

  async get(membershipId: $TSFixMe) {
    let bookshelfMembership;
    try {
      bookshelfMembership = await BookshelfMembership.where('id', membershipId).fetch({
        withRelated: ['user', 'organization'],
      });
    } catch (error) {
      if (error instanceof BookshelfMembership.NotFoundError) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError(`Membership ${membershipId} not found`);
      }
      throw error;
    }

    return _toDomain(bookshelfMembership);
  },

  async findByOrganizationId({
    organizationId
  }: $TSFixMe) {
    const memberships = await BookshelfMembership.where({ organizationId, disabledAt: null })
      .orderBy('id', 'ASC')
      .fetchAll({ withRelated: ['user'] });
    return bookshelfToDomainConverter.buildDomainObjects(BookshelfMembership, memberships);
  },

  async findPaginatedFiltered({
    organizationId,
    filter,
    page
  }: $TSFixMe) {
    const pageSize = page.size ? page.size : DEFAULT_PAGE_SIZE;
    const pageNumber = page.number ? page.number : DEFAULT_PAGE_NUMBER;
    const { models, pagination } = await BookshelfMembership.query((qb: $TSFixMe) => {
      qb.where({ 'memberships.organizationId': organizationId, 'memberships.disabledAt': null });
      _setSearchFiltersForQueryBuilder(filter, qb);
      qb.innerJoin('users', 'memberships.userId', 'users.id');
      qb.orderByRaw('"organizationRole" ASC, LOWER(users."lastName") ASC, LOWER(users."firstName") ASC');
    }).fetchPage({
      withRelated: ['user'],
      page: pageNumber,
      pageSize,
    });
    const memberships = bookshelfToDomainConverter.buildDomainObjects(BookshelfMembership, models);
    return { models: memberships, pagination };
  },

  findByUserIdAndOrganizationId({
    userId,
    organizationId,
    includeOrganization = false
  }: $TSFixMe) {
    return BookshelfMembership.where({ userId, organizationId, disabledAt: null })
      .fetchAll({ withRelated: includeOrganization ? ['organization', 'organization.tags'] : [] })
      .then((memberships: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfMembership, memberships));
  },

  findByUserId({
    userId
  }: $TSFixMe) {
    return BookshelfMembership.where({ userId, disabledAt: null })
      .fetchAll({ withRelated: ['organization'] })
      .then((memberships: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfMembership, memberships));
  },

  async updateById({
    id,
    membership
  }: $TSFixMe) {
    let updatedMembership;

    if (!membership) {
      throw new MembershipUpdateError("Le membership n'est pas renseigné");
    }

    try {
      updatedMembership = await new BookshelfMembership({ id }).save(membership, {
        patch: true,
        method: 'update',
        require: true,
      });
    } catch (err) {
      throw new MembershipUpdateError((err as $TSFixMe).message);
    }

    const updatedMembershipWithUserAndOrganization = await updatedMembership.refresh({
      withRelated: ['user', 'organization'],
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfMembership, updatedMembershipWithUserAndOrganization);
  },
};
