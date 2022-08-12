// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfTag = require('../orm-models/Tag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError, NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(tag: $TSFixMe) {
    try {
      const tagToCreate = omit(tag, 'id');
      const bookshelfTag = await new BookshelfTag(tagToCreate).save();
      return bookshelfToDomainConverter.buildDomainObject(BookshelfTag, bookshelfTag);
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError(`A tag with name ${tag.name} already exists.`);
      }
      throw err;
    }
  },

  async findByName({
    name
  }: $TSFixMe) {
    const tag = await BookshelfTag.where({ name }).fetch({ require: false });

    return bookshelfToDomainConverter.buildDomainObject(BookshelfTag, tag);
  },

  async findAll() {
    const allTags = await BookshelfTag.fetchAll();
    return bookshelfToDomainConverter.buildDomainObjects(BookshelfTag, allTags);
  },

  async get(id: $TSFixMe) {
    try {
      const tag = await BookshelfTag.where({ id }).fetch();
      return bookshelfToDomainConverter.buildDomainObject(BookshelfTag, tag);
    } catch (err) {
      if (err instanceof BookshelfTag.NotFoundError) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError("Le tag n'existe pas");
      }
      throw err;
    }
  },
};
