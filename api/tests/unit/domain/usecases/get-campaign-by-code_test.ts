// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-campaign-by-code', function () {
  const code = 'QWERTY123';
  const campaignToJoinRepository = {
    getByCode: () => {
      return;
    },
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(campaignToJoinRepository, 'getByCode');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the campaign to join', async function () {
    // given
    const campaignToJoin = Symbol('someCampaign');
    (campaignToJoinRepository.getByCode as $TSFixMe).withArgs(code).resolves(campaignToJoin);

    // when
    const actualCampaignToJoin = await usecases.getCampaignByCode({
      code,
      campaignToJoinRepository,
    });

    // then
    expect(actualCampaignToJoin).to.deep.equal(campaignToJoin);
  });
});
