// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, domainBuilder, databaseBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError, NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../lib/domain/models/Tag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagReposit... Remove this comment to see the full error message
const tagRepository = require('../../../../lib/infrastructure/repositories/tag-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | TagRepository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('tags').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a Tag', async function () {
      // given
      const tag = domainBuilder.buildTag({ name: 'A Tag' });

      // when
      const createdTag = await tagRepository.create(tag);

      // then
      expect(createdTag).to.be.instanceOf(Tag);
      expect(createdTag.name).to.equal(tag.name);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a tag name already exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an AlreadyExistingEntityError', async function () {
        // given
        const existingTag = databaseBuilder.factory.buildTag();
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(tagRepository.create)({ name: existingTag.name });

        // then
        expect(error).to.be.an.instanceof(AlreadyExistingEntityError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the tag if it exists', async function () {
      // given
      const tagName = 'A Tag';
      databaseBuilder.factory.buildTag({ name: tagName });
      await databaseBuilder.commit();

      // when
      const result = await tagRepository.findByName({ name: tagName });

      // then
      expect(result.name).to.equal(tagName);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if the tag doest not exist', async function () {
      // given
      const notExistingTagName = 'notExistingTagName';

      // when
      const result = await tagRepository.findByName({ name: notExistingTagName });

      // then
      expect(result).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAll', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the tags', async function () {
      // given
      const tag1 = new Tag({ id: 100000, name: 'PUBLIC' });
      const tag2 = new Tag({ id: 100001, name: 'PRIVE' });

      databaseBuilder.factory.buildTag(tag1);
      databaseBuilder.factory.buildTag(tag2);
      await databaseBuilder.commit();

      const expectedResult = [tag1, tag2];

      // when
      const result = await tagRepository.findAll();

      // then
      expect(result).to.be.deep.equal(expectedResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a tag by provided id', async function () {
      // given
      const insertedTag = databaseBuilder.factory.buildTag({ id: 1, name: 'AEFE' });
      await databaseBuilder.commit();

      // when
      const foundTag = await tagRepository.get(insertedTag.id);

      // then
      expect(foundTag).to.deep.equal({ id: 1, name: 'AEFE' });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw NotFoundError when tag id is not found', async function () {
      // given
      const nonExistentId = 10083;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(tagRepository.get)(nonExistentId);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
