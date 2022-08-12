// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findUserCampaignParticipationOverviews = require('../../../../lib/domain/usecases/find-user-campaign-participation-overviews');
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-user-campaign-participation-overviews', function () {
  let campaignParticipationOverviewRepository: $TSFixMe;
  let targetProfileWithLearningContentRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignParticipationOverviewRepository = {
      findByUserIdWithFilters: sinon.stub().resolves({
        campaignParticipationOverviews: [],
        pagination: {},
      }),
    };
    targetProfileWithLearningContentRepository = {
      get: sinon.stub().resolves(domainBuilder.buildTargetProfileWithLearningContent.withSimpleLearningContent()),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when states is undefined', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call findByUserIdWithFilters', async function () {
      // given
      const states = undefined;
      const userId = 1;

      // when
      await findUserCampaignParticipationOverviews({
        userId,
        states,
        campaignParticipationOverviewRepository,
        targetProfileWithLearningContentRepository,
      });

      // then
      sinon.assert.calledWith(campaignParticipationOverviewRepository.findByUserIdWithFilters, {
        page: undefined,
        userId,
        states,
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when states is a string', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call findByUserIdWithFilters with an array of states', async function () {
      // given
      const states = 'ONGOING';
      const userId = 1;
      const page = {};

      // when
      await findUserCampaignParticipationOverviews({
        userId,
        states,
        campaignParticipationOverviewRepository,
        targetProfileWithLearningContentRepository,
        page,
      });

      // then
      sinon.assert.calledWith(campaignParticipationOverviewRepository.findByUserIdWithFilters, {
        page,
        userId,
        states: ['ONGOING'],
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when states is an array', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call findByUserIdWithFilters with an array of states', async function () {
      // given
      const states = ['ONGOING'];
      const userId = 1;
      const page = {};

      // when
      await findUserCampaignParticipationOverviews({
        userId,
        states,
        campaignParticipationOverviewRepository,
        targetProfileWithLearningContentRepository,
        page,
      });

      // then
      sinon.assert.calledWith(campaignParticipationOverviewRepository.findByUserIdWithFilters, {
        page,
        userId,
        states: ['ONGOING'],
      });
    });
  });
});
