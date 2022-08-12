// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CampaignProfileRepository = require('../../../../lib/infrastructure/repositories/campaign-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const { PIX_COUNT_BY_LEVEL } = require('../../../../lib/domain/constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ENGLISH_SP... Remove this comment to see the full error message
const { ENGLISH_SPOKEN, FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | CampaignProfileRepository', function () {
  const locale = FRENCH_SPOKEN;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findProfile', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('campaign participation infos', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        mockLearningContent({ areas: [], competences: [], skills: [] });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the creation date, the sharing date and the participantExternalId', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        databaseBuilder.factory.buildCampaignParticipation({ campaignId });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          createdAt: new Date('2020-01-01'),
          sharedAt: new Date('2020-01-02'),
          participantExternalId: 'Friday the 13th',
        });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale,
        });

        expect(campaignProfile.externalId).to.equal('Friday the 13th');
        expect(campaignProfile.createdAt).to.deep.equal(new Date('2020-01-01'));
        expect(campaignProfile.sharedAt).to.deep.equal(new Date('2020-01-02'));
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the campaignParticipationId and campaignId', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale,
        });

        expect(campaignProfile.campaignParticipationId).to.equal(campaignParticipation.id);
        expect(campaignProfile.campaignId).to.equal(campaignId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the campaignParticipationId sharing status', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          createdAt: new Date('2020-01-01'),
          sharedAt: new Date('2020-01-02'),
          participantExternalId: 'Friday the 13th',
        });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale,
        });

        expect(campaignProfile.isShared).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('organization learner infos', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        mockLearningContent({ areas: [], competences: [], skills: [] });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the first name and last name of the organization learner', async function () {
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Greg', lastName: 'Duboire', organizationId },
          { campaignId }
        ).id;
        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId,
          locale,
        });

        expect(campaignProfile.firstName).to.equal('Greg');
        expect(campaignProfile.lastName).to.equal('Duboire');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the first name and last name of the current organization learner', async function () {
        const oldOrganizationId = databaseBuilder.factory.buildOrganization().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const campaignParticipationCreated = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Greg', lastName: 'Duboire', organizationId },
          { campaignId }
        );
        databaseBuilder.factory.buildOrganizationLearner({
          firstName: 'Gregoire',
          lastName: 'Dub',
          organizationId: oldOrganizationId,
          userId: campaignParticipationCreated.userId,
        });
        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipationCreated.id,
          locale,
        });

        expect(campaignProfile.firstName).to.equal('Greg');
        expect(campaignProfile.lastName).to.equal('Duboire');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('certification infos', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const learningContent = {
          areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
          competences: [
            { id: 'rec1', origin: 'Pix', areaId: 'recArea1', nameFrFr: 'French1', nameEnUs: 'English1' },
            { id: 'rec2', origin: 'Pix', areaId: 'recArea1', nameFrFr: 'French2', nameEnUs: 'English2' },
            { id: 'rec3', origin: 'Other', areaId: 'recArea1' },
          ],
          skills: [
            {
              id: 'recSkill1',
              status: 'actif',
              competenceId: 'rec1',
            },
            {
              id: 'recSkill2',
              status: 'actif',
              competenceId: 'rec2',
            },
            {
              id: 'recSkill3',
              status: 'actif',
              competenceId: 'rec3',
            },
          ],
        };

        mockLearningContent(learningContent);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the number of competences', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale,
        });

        expect(campaignProfile.competencesCount).to.equal(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the competences data according to given locale', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale: ENGLISH_SPOKEN,
        });

        const competenceNames = campaignProfile.competences.map((competence: $TSFixMe) => competence.name);
        expect(competenceNames).to.have.members(['English1', 'English2']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the number of competences certifiable', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const user = databaseBuilder.factory.buildUser({ firstName: 'John', lastName: 'Shaft' });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId: user.id,
          sharedAt: new Date('2020-01-02'),
        });
        databaseBuilder.factory.buildKnowledgeElement({
          userId: user.id,
          earnedPix: PIX_COUNT_BY_LEVEL,
          competenceId: 'rec1',
          createdAt: new Date('2020-01-01'),
        });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale,
        });

        expect(campaignProfile.certifiableCompetencesCount).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the total pix score', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const user = databaseBuilder.factory.buildUser({ firstName: 'John', lastName: 'Shaft' });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId: user.id,
          sharedAt: new Date('2020-01-02'),
          pixScore: 80,
        });
        databaseBuilder.factory.buildKnowledgeElement({
          userId: user.id,
          earnedPix: 1024,
          skillId: 'rec12',
          competenceId: 'rec1',
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildKnowledgeElement({
          userId: user.id,
          earnedPix: 1024,
          skillId: 'rec22',
          competenceId: 'rec2',
          createdAt: new Date('2020-01-01'),
        });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale,
        });

        expect(campaignProfile.pixScore).to.equal(80);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('computes certifiable competences acquired before the sharing date of the campaign participation', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const user = databaseBuilder.factory.buildUser({ firstName: 'John', lastName: 'Shaft' });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId: user.id,
          sharedAt: new Date('2020-01-02'),
        });
        databaseBuilder.factory.buildKnowledgeElement({
          userId: user.id,
          earnedPix: PIX_COUNT_BY_LEVEL,
          competenceId: 'rec1',
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildKnowledgeElement({
          userId: user.id,
          earnedPix: PIX_COUNT_BY_LEVEL * 2,
          competenceId: 'rec2',
          createdAt: new Date('2020-01-03'),
        });

        await databaseBuilder.commit();

        const campaignProfile = await CampaignProfileRepository.findProfile({
          campaignId,
          campaignParticipationId: campaignParticipation.id,
          locale,
        });

        expect(campaignProfile.certifiableCompetencesCount).to.equal(1);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no campaign-participation with the given id', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        mockLearningContent({ areas: [], competences: [], skills: [] });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an NotFoundError error', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CampaignProfileRepository.findProfile)({
          campaignId: 1,
          campaignParticipationId: 2,
          locale,
        });

        expect(error).to.be.an.instanceof(NotFoundError);
        expect((error as $TSFixMe).message).to.equal('There is no campaign participation with the id "2"');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no campaign-participation with the given id for the given campaign', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        mockLearningContent({ areas: [], competences: [], skills: [] });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an NotFoundError error', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign({ id: 1 }).id;

        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ id: 3, campaignId }).id;

        await databaseBuilder.commit();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CampaignProfileRepository.findProfile)({
          campaignId: 2,
          campaignParticipationId,
          locale,
        });

        expect(error).to.be.an.instanceof(NotFoundError);
        expect((error as $TSFixMe).message).to.equal(`There is no campaign participation with the id "${campaignParticipationId}"`);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign-participation is deleted with the given id for the given campaign', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        mockLearningContent({ areas: [], competences: [], skills: [] });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a NotFoundError error', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;

        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          deletedAt: new Date('2022-01-01'),
        }).id;

        await databaseBuilder.commit();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CampaignProfileRepository.findProfile)({
          campaignId,
          campaignParticipationId,
          locale,
        });

        expect(error).to.be.an.instanceof(NotFoundError);
        expect((error as $TSFixMe).message).to.equal(`There is no campaign participation with the id "${campaignParticipationId}"`);
      });
    });
  });
});
