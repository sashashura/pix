// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-target-profile-details', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get target profile details', async function () {
    // given
    const expectedResult = Symbol('target profile');
    const targetProfileId = Symbol('target profile id');

    const targetProfileWithLearningContentRepository = {
      get: sinon.stub(),
    };
    targetProfileWithLearningContentRepository.get.withArgs({ id: targetProfileId }).resolves(expectedResult);

    // when
    const response = await usecases.getTargetProfileDetails({
      targetProfileId,
      targetProfileWithLearningContentRepository,
    });

    // then
    expect(response).to.equal(expectedResult);
  });
});
