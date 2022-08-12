// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganizationTag = require('../orm-models/OrganizationTag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError, OrganizationTagNotFound } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const { omit } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const OrganizationTagBookshelf = require('../orm-models/OrganizationTag');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(organizationTag: $TSFixMe) {
    try {
      const organizationTagToCreate = omit(organizationTag, 'id');
      const bookshelfOrganizationTag = await new BookshelfOrganizationTag(organizationTagToCreate).save();
      return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationTag, bookshelfOrganizationTag);
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError(
          `The tag ${organizationTag.tagId} already exists for the organization ${organizationTag.organizationId}.`
        );
      }
      throw err;
    }
  },

  async delete({
    organizationTagId
  }: $TSFixMe) {
    try {
      await BookshelfOrganizationTag.where({ id: organizationTagId }).destroy({ require: true });
    } catch (err) {
      throw new OrganizationTagNotFound('An error occurred while deleting the organization tag');
    }
  },

  async findOneByOrganizationIdAndTagId({
    organizationId,
    tagId
  }: $TSFixMe) {
    const bookshelfOrganizationTags = await BookshelfOrganizationTag.query((qb: $TSFixMe) => {
      qb.where('organizationId', organizationId);
      qb.where('tagId', tagId);
    }).fetchAll();

    return bookshelfOrganizationTags.length > 0
      ? bookshelfToDomainConverter.buildDomainObjects(OrganizationTagBookshelf, bookshelfOrganizationTags)[0]
      : [];
  },

  async batchCreate(organizationsTags: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    return Bookshelf.knex
      .batchInsert('organization-tags', organizationsTags)
      .transacting(domainTransaction.knexTransaction);
  },

  async isExistingByOrganizationIdAndTagId({
    organizationId,
    tagId
  }: $TSFixMe) {
    const organizationTag = await BookshelfOrganizationTag.where({ organizationId, tagId }).fetch({ require: false });

    return !!organizationTag;
  },
};
