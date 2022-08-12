// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { updateParticipantExternalId } = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-participation-external-id', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository method to update the external id for a participation', async function () {
    //given
    const participationsForCampaignManagementRepository = {
      updateParticipantExternalId: sinon.stub(),
    };

    //when
    await updateParticipantExternalId({
      campaignParticipationId: 34,
      participantExternalId: 'new1234567',
      participationsForCampaignManagementRepository,
    });

    //then
    expect(
      participationsForCampaignManagementRepository.updateParticipantExternalId
    ).to.have.been.calledOnceWithExactly({
      campaignParticipationId: 34,
      participantExternalId: 'new1234567',
    });
  });
});
