const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2687): All declarations of 'handlePoleEmploiParticipation... Remove this comment to see the full error message
const handlePoleEmploiParticipationStarted = require('../../../../lib/domain/events/handle-pole-emploi-participation-started');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingRepository = require('../../../../lib/infrastructure/repositories/pole-emploi-sending-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CampaignParticipationStartedEvent = require('../../../../lib/domain/events/CampaignParticipationStarted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Event | Handle Pole emploi participation started', function () {
  let campaignParticipationId: $TSFixMe, userId, event: $TSFixMe, poleEmploiNotifier: $TSFixMe, responseCode: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handlePoleEmploiParticipationStarted', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      responseCode = Symbol('responseCode');
      poleEmploiNotifier = { notify: sinon.stub().resolves({ isSuccessful: true, code: responseCode }) };

      userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId });
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;

      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const tagId = databaseBuilder.factory.buildTag({ name: 'POLE EMPLOI' }).id;
      databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId, organizationId }).id;
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId }).id;
      databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });
      event = new CampaignParticipationStartedEvent();
      event.campaignParticipationId = campaignParticipationId;

      const learningContentObjects = learningContentBuilder.buildLearningContent([]);
      mockLearningContent(learningContentObjects);

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('pole-emploi-sendings').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should notify pole emploi and save success of this notification', async function () {
      // when
      await handlePoleEmploiParticipationStarted({
        event,
        assessmentRepository,
        campaignRepository,
        campaignParticipationRepository,
        organizationRepository,
        poleEmploiSendingRepository,
        targetProfileRepository,
        userRepository,
        poleEmploiNotifier,
      });

      // then
      const poleEmploiSendings = await knex('pole-emploi-sendings').where({ campaignParticipationId });
      expect(poleEmploiSendings.length).to.equal(1);
      expect(poleEmploiSendings[0].responseCode).to.equal(responseCode.toString());
      expect(poleEmploiSendings[0].type).to.equal('CAMPAIGN_PARTICIPATION_START');
    });
  });
});
