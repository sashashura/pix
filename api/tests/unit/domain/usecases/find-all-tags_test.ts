// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findAllTags = require('../../../../lib/domain/usecases/find-all-tags');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-all-tags', function () {
  let tagRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    tagRepository = {
      findAll: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return tags', async function () {
    // given
    const tags = [
      domainBuilder.buildTag({ name: 'TAG1' }),
      domainBuilder.buildTag({ name: 'TAG2' }),
      domainBuilder.buildTag({ name: 'TAG3' }),
    ];
    tagRepository.findAll.returns(tags);

    // when
    const allTags = await findAllTags({ tagRepository });

    // then
    expect(allTags).to.deep.equal(tags);
    expect(tagRepository.findAll).to.have.been.calledOnce;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return an empty array when no tags found', async function () {
    // given
    tagRepository.findAll.returns([]);

    // when
    const allTags = await findAllTags({ tagRepository });

    // then
    expect(allTags).to.be.an('array').that.is.empty;
  });
});
