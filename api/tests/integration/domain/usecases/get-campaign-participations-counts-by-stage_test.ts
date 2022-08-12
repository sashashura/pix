const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
  catchErr,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError, NoStagesForCampaign } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | get-campaign-participations-counts-by-stage', function () {
  let organizationId: $TSFixMe;
  let campaignId: $TSFixMe;
  let userId: $TSFixMe;
  let stage1: $TSFixMe, stage2: $TSFixMe, stage3: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const learningContentObjects = learningContentBuilder.buildLearningContent([
      {
        id: 'recArea1',
        titleFrFr: 'area1_Title',
        color: 'specialColor',
        competences: [
          {
            id: 'recCompetence1',
            name: 'Fabriquer un meuble',
            index: '1.1',
            tubes: [
              {
                id: 'recTube1',
                skills: [
                  { id: 'recSkillId1', nom: '@web1', challenges: [] },
                  { id: 'recSkillId2', nom: '@web2', challenges: [] },
                  { id: 'recSkillId3', nom: '@web3', challenges: [] },
                  { id: 'recSkillId4', nom: '@web4', challenges: [] },
                ],
              },
            ],
          },
        ],
      },
    ]);
    mockLearningContent(learningContentObjects);

    const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
    databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkillId1' });
    databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkillId2' });
    databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkillId3' });
    databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkillId4' });
    organizationId = databaseBuilder.factory.buildOrganization().id;
    userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildMembership({ organizationId, userId });
    stage1 = databaseBuilder.factory.buildStage({
      targetProfileId,
      threshold: 0,
      prescriberTitle: 'title',
      prescriberDescription: 'desc',
    });
    stage2 = databaseBuilder.factory.buildStage({ targetProfileId, threshold: 30 });
    stage3 = databaseBuilder.factory.buildStage({ targetProfileId, threshold: 70 });
    campaignId = databaseBuilder.factory.buildCampaign({ organizationId, targetProfileId }).id;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when requesting user is not allowed to access campaign informations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotAuthorizedToAccessEntityError error', async function () {
      const user2 = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(usecases.getCampaignParticipationsCountByStage)({
        userId: user2.id,
        campaignId,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
      expect((error as $TSFixMe).message).to.equal('User does not belong to the organization that owns the campaign');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the campaign doesnt manage stages', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NoStagesForCampaign error', async function () {
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkillId1' });
      const campaign2 = databaseBuilder.factory.buildCampaign({ organizationId, targetProfileId });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(usecases.getCampaignParticipationsCountByStage)({
        userId,
        campaignId: campaign2.id,
      });

      // then
      expect(error).to.be.instanceOf(NoStagesForCampaign);
      expect((error as $TSFixMe).message).to.equal('The campaign does not have stages.');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the campaign manage stages', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return participations counts by stages', async function () {
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.31 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.72 });
      await databaseBuilder.commit();

      // when
      const result = await usecases.getCampaignParticipationsCountByStage({ userId, campaignId });

      // then
      expect(result).to.deep.equal([
        { id: stage1.id, value: 1, title: stage1.prescriberTitle, description: stage1.prescriberDescription },
        { id: stage2.id, value: 1, title: null, description: null },
        { id: stage3.id, value: 1, title: null, description: null },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set to 0 all participation counts when no participations', async function () {
      await databaseBuilder.commit();

      // when
      const result = await usecases.getCampaignParticipationsCountByStage({ userId, campaignId });

      // then
      expect(result).to.deep.equal([
        { id: stage1.id, value: 0, title: stage1.prescriberTitle, description: stage1.prescriberDescription },
        { id: stage2.id, value: 0, title: null, description: null },
        { id: stage3.id, value: 0, title: null, description: null },
      ]);
    });
  });
});
