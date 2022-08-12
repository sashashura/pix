// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'participan... Remove this comment to see the full error message
const participantResultsSharedRepository = require('../../../../lib/infrastructure/repositories/participant-results-shared-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
const { MAX_REACHABLE_PIX_BY_COMPETENCE } = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Participant Result Shared Repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there is no target profile', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('computes the participant results for the complete learning content', async function () {
        const { id: campaignId } = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });

        const participation = _buildParticipationWithSnapshot({ campaignId, sharedAt: new Date('2020-01-02') }, [
          { skillId: 'skill_1', status: 'validated', earnedPix: 0 },
          { skillId: 'skill_2', status: 'validated', earnedPix: 3 },
          { skillId: 'skill_3', status: 'validated', earnedPix: 1 },
        ]);

        await databaseBuilder.commit();

        const learningContent = {
          skills: [{ id: 'skill_1' }, { id: 'skill_2' }, { id: 'skill_3' }],
        };
        mockLearningContent(learningContent);

        //when
        const participantResultsShared = await participantResultsSharedRepository.get(participation.id);

        expect(participantResultsShared.masteryRate).to.equals(4 / (16 * MAX_REACHABLE_PIX_BY_COMPETENCE));
        expect(participantResultsShared.id).to.equal(participation.id);
        expect(participantResultsShared.pixScore).to.equals(4);
        expect(participantResultsShared.validatedSkillsCount).to.equals(3);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there is a target profile', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('computes the participant results for a target profile', async function () {
        const skillIds = ['skill_1', 'skill_2'];

        const { id: campaignId } = _buildCampaignForSkills(skillIds);

        const participation = _buildParticipationWithSnapshot({ campaignId, sharedAt: new Date('2020-01-02') }, [
          { skillId: 'skill_1', status: 'validated', earnedPix: 2 },
          { skillId: 'skill_2', status: 'validated', earnedPix: 3 },
          { skillId: 'skill_3', status: 'validated', earnedPix: 1 },
        ]);

        await databaseBuilder.commit();

        const learningContent = {
          skills: [
            { id: 'skill_1', status: 'actif' },
            { id: 'skill_2', status: 'actif' },
            { id: 'skill_3', status: 'actif' },
          ],
        };
        mockLearningContent(learningContent);

        //when
        const participantResultsShared = await participantResultsSharedRepository.get(participation.id);

        expect(participantResultsShared.masteryRate).to.equals(1);
        expect(participantResultsShared.id).to.equal(participation.id);
        expect(participantResultsShared.pixScore).to.equals(5);
        expect(participantResultsShared.validatedSkillsCount).to.equals(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when there are active, archived and deprecated skills', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('computes the participant results using operative skills', async function () {
          const skillIds = ['skill_1', 'skill_2', 'skill_3'];

          const { id: campaignId } = _buildCampaignForSkills(skillIds);

          const participation = _buildParticipationWithSnapshot({ campaignId, sharedAt: new Date('2020-01-02') }, [
            { skillId: 'skill_1', status: 'validated', earnedPix: 1 },
            { skillId: 'skill_2', status: 'validated', earnedPix: 3 },
            { skillId: 'skill_3', status: 'validated', earnedPix: 5 },
          ]);

          await databaseBuilder.commit();

          const learningContent = {
            skills: [
              { id: 'skill_1', status: 'actif' },
              { id: 'skill_2', status: 'archivé' },
              { id: 'skill_3', status: 'périmé' },
            ],
          };
          mockLearningContent(learningContent);

          //when
          const participantResultsShared = await participantResultsSharedRepository.get(participation.id);
          expect(participantResultsShared.masteryRate).to.equals(1);
          expect(participantResultsShared.id).to.equal(participation.id);
          expect(participantResultsShared.pixScore).to.equals(4);
          expect(participantResultsShared.validatedSkillsCount).to.equals(2);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when there are invalidated knowledge elements', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('computes the participant results counting only validated knowledge element for the mastery percentage and validated skills count', async function () {
          const skillIds = ['skill_1', 'skill_2', 'skill_3'];

          const { id: campaignId } = _buildCampaignForSkills(skillIds);

          const participation = _buildParticipationWithSnapshot({ campaignId, sharedAt: new Date('2020-01-02') }, [
            { skillId: 'skill_1', status: 'validated', earnedPix: 1 },
            { skillId: 'skill_2', status: 'validated', earnedPix: 3 },
            { skillId: 'skill_3', status: 'invalidated', earnedPix: 0 },
          ]);

          await databaseBuilder.commit();

          const learningContent = {
            skills: [
              { id: 'skill_1', status: 'actif' },
              { id: 'skill_2', status: 'actif' },
              { id: 'skill_3', status: 'actif' },
            ],
          };
          mockLearningContent(learningContent);

          //when
          const participantResultsShared = await participantResultsSharedRepository.get(participation.id);

          expect(participantResultsShared.id).to.equal(participation.id);
          expect(participantResultsShared.masteryRate).to.equals(2 / 3);
          expect(participantResultsShared.pixScore).to.equals(4);
          expect(participantResultsShared.validatedSkillsCount).to.equals(2);
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return results for the given campaign participation', async function () {
      const { id: campaignId } = _buildCampaignForSkills(['skill_1']);

      _buildParticipationWithSnapshot({}, []);

      const participation = _buildParticipationWithSnapshot({ campaignId, sharedAt: new Date('2020-01-02') }, [
        { skillId: 'skill_1', status: 'validated', earnedPix: 1 },
      ]);

      await databaseBuilder.commit();

      const learningContent = { skills: [{ id: 'skill_1', status: 'actif' }] };
      mockLearningContent(learningContent);

      //when
      const participantResultsShared = await participantResultsSharedRepository.get(participation.id);

      expect(participantResultsShared.masteryRate).to.equals(1);
    });
  });
});

// @ts-expect-error TS(2393): Duplicate function implementation.
function _buildCampaignForSkills(skillIds: $TSFixMe) {
  const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();

  skillIds.forEach((skillId: $TSFixMe) => {
    databaseBuilder.factory.buildTargetProfileSkill({ skillId, targetProfileId });
  });

  return databaseBuilder.factory.buildCampaign({ targetProfileId, type: CampaignTypes.ASSESSMENT });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _buildParticipationWithSnapshot(participationAttributes: $TSFixMe, knowledgeElementsAttributes: $TSFixMe) {
  const participation = databaseBuilder.factory.buildCampaignParticipation(participationAttributes);

  databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
    userId: participation.userId,
    snappedAt: participation.sharedAt,
    knowledgeElementsAttributes,
  });

  return participation;
}
