// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const attachTargetProfilesToOrganization = require('../../../../lib/domain/usecases/attach-target-profiles-to-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | attach-target-profiles-to-organization', function () {
  let organizationRepository: $TSFixMe;
  let targetProfileShareRepository: $TSFixMe;
  let targetProfileRepository: $TSFixMe;
  let targetProfileIdsToAttach;
  const organizationId = 1;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationRepository = {
      get: sinon.stub(),
    };
    targetProfileRepository = {
      findByIds: sinon.stub(),
    };
    targetProfileShareRepository = {
      addTargetProfilesToOrganization: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository with organizationId and targetProfileIdsToAttach', async function () {
    // given
    targetProfileIdsToAttach = [1];
    targetProfileRepository.findByIds.withArgs(targetProfileIdsToAttach).resolves([{ id: 1 }]);
    organizationRepository.get.withArgs(organizationId).resolves({ targetProfileShares: [] });

    const expectedResult = { attachedIds: targetProfileIdsToAttach };
    targetProfileShareRepository.addTargetProfilesToOrganization
      .withArgs({ organizationId, targetProfileIdList: targetProfileIdsToAttach })
      .resolves(expectedResult);

    // when
    const result = await attachTargetProfilesToOrganization({
      targetProfileShareRepository,
      targetProfileRepository,
      organizationRepository,
      organizationId,
      targetProfileIdsToAttach,
    });

    // then
    expect(result).to.equal(expectedResult);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should delete duplicated targetProfileId', async function () {
    // given
    targetProfileIdsToAttach = [1, 2, 2];
    const cleanedTargetProfileIdsToAttach = [1, 2];
    targetProfileRepository.findByIds.withArgs(cleanedTargetProfileIdsToAttach).resolves([{ id: 1 }, { id: 2 }]);
    organizationRepository.get.withArgs(organizationId).resolves({ targetProfileShares: [] });

    const expectedResult = { attachedIds: cleanedTargetProfileIdsToAttach };
    targetProfileShareRepository.addTargetProfilesToOrganization
      .withArgs({ organizationId, targetProfileIdList: cleanedTargetProfileIdsToAttach })
      .resolves(expectedResult);

    // when
    const result = await attachTargetProfilesToOrganization({
      targetProfileShareRepository,
      targetProfileRepository,
      organizationRepository,
      organizationId,
      targetProfileIdsToAttach,
    });

    // then
    expect(result).to.equal(expectedResult);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a NotFoundError when a target profile does not exist', async function () {
    // given
    targetProfileIdsToAttach = [1, 2];
    targetProfileRepository.findByIds.withArgs(targetProfileIdsToAttach).resolves([{ id: 2 }]);
    organizationRepository.get.withArgs(organizationId).resolves({ targetProfileShares: [] });

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(attachTargetProfilesToOrganization)({
      targetProfileShareRepository,
      targetProfileRepository,
      organizationRepository,
      organizationId,
      targetProfileIdsToAttach,
    });

    // then
    expect(error).to.be.instanceOf(NotFoundError);
    expect((error as $TSFixMe).message).to.equal("Le profil cible 1 n'existe pas.");
  });
});
