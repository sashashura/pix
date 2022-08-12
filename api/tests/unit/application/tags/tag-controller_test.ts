// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagControl... Remove this comment to see the full error message
const tagController = require('../../../../lib/application/tags/tag-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagSeriali... Remove this comment to see the full error message
const tagSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/tag-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Tags | tag-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the created tag', async function () {
      // given
      const createdTag = domainBuilder.buildTag({ id: 1, name: 'TAG1' });
      const serializedTag = Symbol('a serialized tag');

      sinon.stub(usecases, 'createTag').resolves(createdTag);
      sinon.stub(tagSerializer, 'serialize').withArgs(createdTag).returns(serializedTag);

      const request = { payload: { data: { attributes: { name: 'tag1' } } } };

      // when
      const result = await tagController.create(request, hFake);

      // then
      expect(result.statusCode).to.be.equal(201);
      expect(result.source).to.be.equal(serializedTag);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAllTags', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call findAllTags usecase and tag serializer', async function () {
      // given
      const tag1 = domainBuilder.buildTag({ id: 1, name: 'TAG1' });
      const tag2 = domainBuilder.buildTag({ id: 2, name: 'TAG2' });
      const tag3 = domainBuilder.buildTag({ id: 3, name: 'TAG3' });

      const tags = [tag1, tag2, tag3];

      sinon.stub(usecases, 'findAllTags').resolves(tags);
      sinon.stub(tagSerializer, 'serialize').resolves();

      // when
      await tagController.findAllTags();

      // then
      expect(usecases.findAllTags).to.have.been.calledOnce;
      expect(tagSerializer.serialize).to.have.been.calledWithExactly(tags);
    });
  });
});
