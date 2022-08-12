// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForCreation = require('../../../../lib/domain/models/TargetProfileForCreation');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createTargetProfile = require('../../../../lib/domain/usecases/create-target-profile');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-target-profile', function () {
  let targetProfileRepositoryStub: $TSFixMe;
  let targetProfileWithLearningContentRepositoryStub: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    targetProfileRepositoryStub = {
      create: sinon.stub(),
    };

    targetProfileWithLearningContentRepositoryStub = {
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create target profile with skills given data', async function () {
    //given
    const skillIds = ['skill1-tube1', 'skill3-tube1'];
    const targetProfileWithLearningContent = Symbol('ok');
    const targetProfileData = {
      isPublic: true,
      name: 'name',
      skillIds,
    };
    const targetProfileId = 12;
    const targetProfileForCreation = new TargetProfileForCreation(targetProfileData);

    targetProfileRepositoryStub.create.withArgs(targetProfileForCreation).resolves(targetProfileId);
    targetProfileWithLearningContentRepositoryStub.get
      .withArgs({ id: targetProfileId })
      .resolves(targetProfileWithLearningContent);

    //when
    const result = await createTargetProfile({
      targetProfileData,
      targetProfileRepository: targetProfileRepositoryStub,
      targetProfileWithLearningContentRepository: targetProfileWithLearningContentRepositoryStub,
    });

    //then
    expect(result).to.equal(targetProfileWithLearningContent);
  });
});
