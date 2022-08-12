// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { markTargetProfileAsSimplifiedAccess } = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | mark-target-profile-as-simplified-access', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository method to update "isSimplifiedAccess" in target profile', async function () {
    //given
    const targetProfileRepository = {
      update: sinon.stub(),
    };
    const targetProfile = domainBuilder.buildTargetProfile({ id: 12345, isSimplifiedAccess: false });
    targetProfileRepository.update.resolves({ id: targetProfile.id, isSimplifiedAccess: true });

    //when
    const result = await markTargetProfileAsSimplifiedAccess({
      id: targetProfile.id,
      targetProfileRepository,
    });

    //then
    expect(targetProfileRepository.update).to.have.been.calledOnceWithExactly({
      id: 12345,
      isSimplifiedAccess: true,
    });
    expect(result).to.deep.equal({ id: targetProfile.id, isSimplifiedAccess: true });
  });
});
