// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, knex, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignAssessmentParticipationResultRepository = require('../../../../lib/infrastructure/repositories/campaign-assessment-participation-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ENGLISH_SP... Remove this comment to see the full error message
const { ENGLISH_SPOKEN, FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Assessment Participation Result', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCampaignIdAndCampaignParticipationId', function () {
    let campaignId: $TSFixMe, campaignParticipationId: $TSFixMe, targetProfileId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'skill1' });
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'skill2' });

      const learningContent = {
        areas: [
          {
            id: 'recArea0',
            competenceIds: ['rec1', 'rec2'],
            color: 'orange',
          },
        ],
        competences: [
          {
            id: 'rec1',
            index: '1.1',
            areaId: 'recArea0',
            skillIds: ['skill1'],
            origin: 'Pix',
            nameFrFr: 'Compétence 1',
            nameEnUs: 'English competence 1',
          },
          {
            id: 'rec2',
            index: '1.2',
            areaId: 'recArea0',
            skillIds: ['skill2'],
            origin: 'Pix',
            nameFrFr: 'Compétence 2',
            nameEnUs: 'English competence 2',
          },
        ],
        thematics: [],
        tubes: [
          {
            id: 'recTube1',
            competenceId: 'rec1',
          },
          {
            id: 'recTube2',
            competenceId: 'rec2',
          },
        ],
        skills: [
          {
            id: 'skill1',
            name: '@acquis1',
            status: 'actif',
            tubeId: 'recTube1',
            competenceId: 'rec1',
          },
          {
            id: 'skill2',
            name: '@acquis2',
            status: 'actif',
            tubeId: 'recTube2',
            competenceId: 'rec1',
          },
        ],
        challenges: [],
      };

      mockLearningContent(learningContent);
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('knowledge-element-snapshots').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When campaign participation is shared', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        campaignId = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT', targetProfileId }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          sharedAt: new Date('2020-01-02'),
        }).id;

        databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });

        databaseBuilder.factory.buildKnowledgeElement({
          userId,
          skillId: 'skill1',
          competenceId: 'rec1',
          createdAt: new Date('2020-01-01'),
          status: KnowledgeElement.StatusType.VALIDATED,
        });
        databaseBuilder.factory.buildKnowledgeElement({
          userId,
          skillId: 'skill2',
          competenceId: 'rec2',
          createdAt: new Date('2020-01-01'),
          status: KnowledgeElement.StatusType.INVALIDATED,
        });
        databaseBuilder.factory.buildKnowledgeElement({
          userId,
          skillId: 'skill3',
          competenceId: 'rec2',
          createdAt: new Date('2020-01-01'),
          status: KnowledgeElement.StatusType.VALIDATED,
        });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('fills competenceResults', async function () {
        const expectedResult = [
          {
            areaColor: 'orange',
            id: `${campaignParticipationId}-rec1`,
            index: '1.1',
            name: 'Compétence 1',
            competenceMasteryRate: 1,
          },
          {
            areaColor: 'orange',
            id: `${campaignParticipationId}-rec2`,
            index: '1.2',
            name: 'Compétence 2',
            competenceMasteryRate: 0,
          },
        ];

        const campaignAssessmentParticipationResult =
          await campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId({
            campaignId,
            campaignParticipationId,
          });

        expect(campaignAssessmentParticipationResult.isShared).to.equal(true);
        expect(campaignAssessmentParticipationResult.competenceResults.length).to.equal(2);
        expect(campaignAssessmentParticipationResult.competenceResults).to.deep.equal(expectedResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When given locale is fr', function () {
      const locale = FRENCH_SPOKEN;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        campaignId = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT', targetProfileId }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          sharedAt: new Date('2020-01-02'),
        }).id;
        databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns french', async function () {
        const campaignAssessmentParticipationResult =
          await campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId({
            campaignId,
            campaignParticipationId,
            locale,
          });

        expect(campaignAssessmentParticipationResult.competenceResults[0].name).to.equal('Compétence 1');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When given locale is en', function () {
      const locale = ENGLISH_SPOKEN;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        campaignId = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT', targetProfileId }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          sharedAt: new Date('2020-01-02'),
        }).id;
        databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns english', async function () {
        const campaignAssessmentParticipationResult =
          await campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId({
            campaignId,
            campaignParticipationId,
            locale,
          });

        expect(campaignAssessmentParticipationResult.competenceResults[0].name).to.equal('English competence 1');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When no given locale', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        campaignId = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT', targetProfileId }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          sharedAt: new Date('2020-01-02'),
        }).id;
        databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns french', async function () {
        const campaignAssessmentParticipationResult =
          await campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId({
            campaignId,
            campaignParticipationId,
          });

        expect(campaignAssessmentParticipationResult.competenceResults[0].name).to.equal('Compétence 1');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When something is wrong with a campaign participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a NotFoundError when no existing campaign participation', async function () {
        campaignId = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT', targetProfileId }).id;

        await databaseBuilder.commit();

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(
          campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId
        )({ campaignId, campaignParticipationId: 77777 });

        //then
        expect(error).to.be.instanceof(NotFoundError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a NotFoundError when campaign participation is deleted', async function () {
        campaignId = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT', targetProfileId }).id;
        campaignParticipationId = databaseBuilder.factory.buildAssessmentFromParticipation({
          sharedAt: null,
          deletedAt: new Date('2022-01-01'),
          campaignId,
        }).campaignParticipationId;

        await databaseBuilder.commit();

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(
          campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId
        )({ campaignId, campaignParticipationId });

        //then
        expect(error).to.be.instanceof(NotFoundError);
      });
    });
  });
});
