// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../lib/domain/models/Tag');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createTag = require('../../../../lib/domain/usecases/create-tag');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-tag', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should allow to create a tag', async function () {
    // given
    const tagName = 'New name';
    const tag = new Tag({ name: tagName });
    const createdTag = domainBuilder.buildTag({ name: tagName });

    const tagRepository = { create: sinon.stub() };
    tagRepository.create.withArgs(tag).resolves(createdTag);

    // when
    const result = await createTag({ tagName, tagRepository });

    // then
    expect(result).to.be.equal(createdTag);
  });
});
