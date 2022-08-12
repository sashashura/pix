// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { outdateTargetProfile } = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | outdate-target-profile', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository method to update a target profile name', async function () {
    //given
    const targetProfileRepository = {
      update: sinon.stub(),
    };

    //when
    await outdateTargetProfile({ id: 123, outdated: true, targetProfileRepository });

    //then
    expect(targetProfileRepository.update).to.have.been.calledOnceWithExactly({ id: 123, outdated: true });
  });
});
