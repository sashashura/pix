// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { updateTargetProfile } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForUpdate = require('../../../../lib/domain/models/TargetProfileForUpdate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-target-profile', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository method to update a target profile', async function () {
    //given
    const targetProfileForUpdateRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
    };

    const targetProfileToUpdate = new TargetProfileForUpdate({
      id: 123,
      name: 'name',
      description: 'description',
      comment: 'comment',
    });

    const expectedTargetProfile = new TargetProfileForUpdate({
      id: 123,
      name: 'Tom',
      description: 'description changée',
      comment: 'commentaire changé',
      category: 'OTHER',
    });

    await targetProfileForUpdateRepository.get.withArgs(123).resolves(targetProfileToUpdate);

    //when
    await updateTargetProfile({
      id: 123,
      name: 'Tom',
      description: 'description changée',
      comment: 'commentaire changé',
      category: 'OTHER',
      targetProfileForUpdateRepository,
    });

    //then
    expect(targetProfileForUpdateRepository.update).to.have.been.calledOnceWithExactly(expectedTargetProfile);
  });
});
