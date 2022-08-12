// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findCampaignParticipationsForUserManagement = require('../../../../lib/domain/usecases/find-campaign-participations-for-user-management');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | findCampaignParticipationsForUserManagement', function () {
  const userId = 1;
  let expectedParticipationsForUserManagement: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    expectedParticipationsForUserManagement = [
      domainBuilder.buildParticipationForCampaignManagement(),
      domainBuilder.buildParticipationForCampaignManagement(),
      domainBuilder.buildParticipationForCampaignManagement(),
    ];
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fetch campaign participations matching campaign', async function () {
    const participationsForUserManagementRepository = {
      findByUserId: sinon.stub(),
    };
    participationsForUserManagementRepository.findByUserId
      .withArgs(userId)
      .resolves(expectedParticipationsForUserManagement);

    const foundParticipationsForUserManagement = await findCampaignParticipationsForUserManagement({
      userId,
      participationsForUserManagementRepository,
    });

    expect(foundParticipationsForUserManagement).to.deep.equal(expectedParticipationsForUserManagement);
  });
});
