// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCases'.
const useCases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | find-assessment-participation-result-list', function () {
  let organizationId;
  let campaignId: $TSFixMe;
  const page = { number: 1 };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
    const skill = { id: 'recSkill', status: 'actif' };
    databaseBuilder.factory.buildTargetProfileSkill({
      targetProfileId: targetProfileId,
      skillId: skill.id,
    });

    organizationId = databaseBuilder.factory.buildOrganization().id;
    campaignId = databaseBuilder.factory.buildCampaign({ organizationId, targetProfileId }).id;

    const participation1 = { participantExternalId: 'Yubaba', campaignId, status: 'SHARED' };
    const participant1 = { firstName: 'Chihiro', lastName: 'Ogino' };
    databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(participant1, participation1);

    const participation2 = { participantExternalId: 'Meï', campaignId, status: 'SHARED' };
    const participant2 = { firstName: 'Tonari', lastName: 'No Totoro' };
    databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(participant2, participation2);

    mockLearningContent({ skills: [skill], tubes: [], thematics: [], competences: [], areas: [], challenges: [] });

    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are filters', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the assessmentParticipationResultMinimal list filtered by the search', async function () {
      const { participations } = await useCases.findAssessmentParticipationResultList({
        campaignId,
        filters: { search: 'Tonari N' },
        page,
      });

      expect(participations.length).to.equal(1);
    });
  });
});
