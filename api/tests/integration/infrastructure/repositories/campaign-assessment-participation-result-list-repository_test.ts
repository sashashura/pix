// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, mockLearningContent, learningContentBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignAssessmentParticipationResultListRepository = require('../../../../lib/infrastructure/repositories/campaign-assessment-participation-result-list-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Assessment Participation Result List', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedByCampaignId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('knowledge-element-snapshots').delete();
    });

    let campaign: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participants have not retried', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The good',
            campaignId: campaign.id,
          },
          {
            firstName: 'John',
            lastName: 'Doe',
          }
        );

        databaseBuilder.factory.buildAssessmentFromParticipation({
          participantExternalId: 'The bad',
          campaignId: campaign.id,
          status: STARTED,
        });

        databaseBuilder.factory.buildAssessmentFromParticipation({
          participantExternalId: 'The ugly',
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the list of participations shared for the given campaign', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.have.lengthOf(1);
        expect(participations[0]).to.include({
          firstName: 'John',
          lastName: 'Doe',
          participantExternalId: 'The good',
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a participant has retried', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);
        const { id: userId } = databaseBuilder.factory.buildUser();

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'My first',
          campaignId: campaign.id,
          isImproved: true,
          userId,
        });

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'My last',
          campaignId: campaign.id,
          isImproved: false,
          userId,
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the list of participations shared for the given campaign', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.have.lengthOf(1);
        expect(participations[0].participantExternalId).to.equal('My last');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is an organization learner', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          {
            firstName: 'Joe',
            lastName: 'Le taxi',
            organizationId: campaign.organizationId,
          },
          {
            campaignId: campaign.id,
          }
        );
        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the name from the organization learner', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.have.lengthOf(1);
        expect(participations[0]).to.include({
          firstName: 'Joe',
          lastName: 'Le taxi',
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are badges acquired', function () {
      let badge1Id: $TSFixMe, badge2Id;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);
        const { id: userId } = databaseBuilder.factory.buildUser({
          firstName: 'Jane',
          lastName: 'Le uber',
        });
        const { id: campaignParticipationId } = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
        });
        badge1Id = databaseBuilder.factory.buildBadge({
          key: 'Badge1',
          targetProfileId: campaign.targetProfileId,
          title: 'BadgeTitle',
          altMessage: 'BadgeMessage',
          imageUrl: 'BadgeImageUrl',
        }).id;
        badge2Id = databaseBuilder.factory.buildBadge({ key: 'Badge2' }).id;

        databaseBuilder.factory.buildBadgeAcquisition({ userId, badgeId: badge1Id, campaignParticipationId });
        databaseBuilder.factory.buildBadgeAcquisition({ userId, badgeId: badge2Id });
        await databaseBuilder.commit();
        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns acquired badges during the campaign', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations[0].badges).to.deep.equal([
          {
            id: badge1Id,
            title: 'BadgeTitle',
            altMessage: 'BadgeMessage',
            imageUrl: 'BadgeImageUrl',
          },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a participation deleted', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const { id: userId } = databaseBuilder.factory.buildUser();
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        databaseBuilder.factory.buildAssessmentFromParticipation({
          campaignId: campaign.id,
          deletedAt: new Date('2022-03-31'),
          deletedBy: userId,
        });
        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not return deleted participations', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('masteryRate', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [
          { id: 'Skill1' },
          { id: 'Skill2' },
          { id: 'Skill3' },
        ]);

        const { id: userId } = databaseBuilder.factory.buildUser({});

        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
          masteryRate: 0.33,
        });

        await databaseBuilder.commit();
        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1' }, { id: 'Skill2' }, { id: 'Skill3' }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('computes the mastery percentage', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations[0].masteryRate).to.equal(0.33);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('order', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return participants data summary ordered by last name then first name asc (including organization learner data)', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({ organizationId }, [{ id: 'Skill1' }]);
        const campaignParticipation = { campaignId: campaign.id };
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Jaja', lastName: 'Le raplapla', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Jiji', lastName: 'Le riquiqui', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Jojo', lastName: 'le rococo', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'juju', lastName: 'Le riquiqui', organizationId },
          campaignParticipation,
          true
        );

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });
        const names = participations.map((result: $TSFixMe) => result.firstName);

        // then
        expect(names).exactlyContainInOrder(['Jaja', 'Jiji', 'juju', 'Jojo']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('pagination', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        const participation = {
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation);
        databaseBuilder.factory.buildAssessmentFromParticipation(participation);

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated campaign participations based on the given size and number', async function () {
        const page = { size: 1, number: 1 };

        const { participations, pagination } =
          await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            page,
          });
        const participantExternalIds = participations.map((summary: $TSFixMe) => summary.participantExternalId);

        expect(participantExternalIds).to.have.lengthOf(1);
        expect(pagination).to.deep.equals({ page: 1, pageCount: 2, pageSize: 1, rowCount: 2 });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('default pagination', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

          const participation = {
            campaignId: campaign.id,
          };

          for (let i = 0; i < 11; i++) {
            databaseBuilder.factory.buildAssessmentFromParticipation(participation);
          }

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the first page with 10 elements', async function () {
          const { participations, pagination } =
            await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
              campaignId: campaign.id,
            });
          const participantExternalIds = participations.map((summary: $TSFixMe) => summary.participantExternalId);

          expect(participantExternalIds).to.have.lengthOf(10);
          expect(pagination).to.deep.equals({ page: 1, pageCount: 2, pageSize: 10, rowCount: 11 });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are zero rows', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the first page with O elements', async function () {
          const { participations, pagination } =
            await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
              campaignId: campaign.id,
            });
          const participantExternalIds = participations.map((summary: $TSFixMe) => summary.participantExternalId);

          expect(participantExternalIds).to.have.lengthOf(0);
          expect(pagination).to.deep.equals({ page: 1, pageCount: 0, pageSize: 10, rowCount: 0 });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on division', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have the correct division', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        const participation1 = {
          participantExternalId: 'The good',
          campaignId: campaign.id,
        };
        databaseBuilder.factory.buildAssessmentFromParticipation(participation1, {
          organizationId: campaign.organizationId,
          division: 'Good Guys Team',
        });

        const participation2 = {
          participantExternalId: 'The bad',
          campaignId: campaign.id,
        };
        databaseBuilder.factory.buildAssessmentFromParticipation(participation2, {
          organizationId: campaign.organizationId,
          division: 'Bad Guys Team',
        });

        const participation3 = {
          participantExternalId: 'The ugly',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation3, {
          organizationId: campaign.organizationId,
          division: 'Ugly Guys Team',
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { divisions: ['Good Guys Team', 'Ugly Guys Team'] },
        });

        const participantExternalIds = participations.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good', 'The ugly']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on badges', function () {
      let badge1: $TSFixMe;
      let badge2: $TSFixMe;
      let user1: $TSFixMe;
      let user2: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);
        badge1 = databaseBuilder.factory.buildBadge({ key: 'badge1', targetProfileId: campaign.targetProfileId });
        badge2 = databaseBuilder.factory.buildBadge({ key: 'badge2', targetProfileId: campaign.targetProfileId });
        user1 = databaseBuilder.factory.buildUser();
        user2 = databaseBuilder.factory.buildUser();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have one badge', async function () {
        const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user1.id,
          participantExternalId: 'The good',
        });
        databaseBuilder.factory.buildAssessment({
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });

        const campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user2.id,
          participantExternalId: 'The bad',
        });
        databaseBuilder.factory.buildAssessment({
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge2.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { badges: [badge1.id] },
        });

        const participantExternalIds = participations.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have several badges', async function () {
        const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user1.id,
          participantExternalId: 'The good',
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });

        const campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user2.id,
          participantExternalId: 'The bad',
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge2.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });

        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { badges: [badge1.id, badge2.id] },
        });

        const participantExternalIds = participations.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The bad']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not return participants which has not shared but has the badge', async function () {
        const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user1.id,
          participantExternalId: 'The good',
        });
        databaseBuilder.factory.buildAssessment({
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });

        const campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user2.id,
          participantExternalId: 'The bad',
          status: STARTED,
        });
        databaseBuilder.factory.buildAssessment({
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { badges: [badge1.id] },
        });

        const participantExternalIds = participations.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on stage', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1' }, { id: 'Skill2' }, { id: 'Skill3' }, { id: 'Skill4' }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have the given stage', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [
          { id: 'Skill1' },
          { id: 'Skill2' },
          { id: 'Skill3' },
          { id: 'Skill4' },
        ]);
        databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 0 });
        const { id: stageId } = databaseBuilder.factory.buildStage({
          targetProfileId: campaign.targetProfileId,
          threshold: 25,
        });
        databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 75 });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0,
          participantExternalId: 'Juste Before',
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0.25,
          participantExternalId: 'Stage Reached Boundary IN',
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0.74,
          participantExternalId: 'Stage Reached Boundary OUT',
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0.75,
          participantExternalId: 'Just After',
          campaignId: campaign.id,
        });
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { stages: [stageId] },
        });

        const participantExternalIds = participations.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['Stage Reached Boundary IN', 'Stage Reached Boundary OUT']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have validated skill count between several boundaries', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [
          { id: 'Skill1' },
          { id: 'Skill2' },
          { id: 'Skill3' },
        ]);

        const { id: stage1Id } = databaseBuilder.factory.buildStage({
          targetProfileId: campaign.targetProfileId,
          threshold: 0,
        });
        const { id: stage2Id } = databaseBuilder.factory.buildStage({
          targetProfileId: campaign.targetProfileId,
          threshold: 33,
        });
        databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 66 });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0,
          participantExternalId: 'The good',
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0.33,
          participantExternalId: 'The bad',
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0.66,
          participantExternalId: 'The ugly',
          campaignId: campaign.id,
        });
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { stages: [stage1Id, stage2Id] },
        });

        const participantExternalIds = participations.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good', 'The bad']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on groups', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have the correct groups', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        const participation1 = {
          participantExternalId: 'Sans',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation1, {
          organizationId: campaign.organizationId,
          group: 'Bad Puns Team',
        });

        const participation2 = {
          participantExternalId: 'Papyrus',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation2, {
          organizationId: campaign.organizationId,
          group: 'Royal Guard',
        });

        const participation3 = {
          participantExternalId: 'Asriel',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation3, {
          organizationId: campaign.organizationId,
          group: 'Adoptive Brother',
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { groups: ['Royal Guard', 'Bad Puns Team'] },
        });

        const participantExternalIds = participations.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['Sans', 'Papyrus']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on the firstname and lastname', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        // given
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns all participants if the filter is empty', async function () {
        // given
        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Saphira',
            lastName: 'Eurasier',
          }
        );

        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: '' },
        });

        // then
        expect(participations.length).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search part its firstname', async function () {
        // given
        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Choupette',
            lastName: 'Eurasier',
          }
        );

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The boy',
            campaignId: campaign.id,
          },
          {
            firstName: 'Salto',
            lastName: 'Irish terrier',
          }
        );

        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: 'Chou' },
        });

        // then
        expect(participations.length).to.equal(1);
        expect(participations[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search contains a space before', async function () {
        // given
        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Choupette',
            lastName: 'Eurasier',
          }
        );

        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: ' Cho' },
        });

        // then
        expect(participations.length).to.equal(1);
        expect(participations[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search contains a space after', async function () {
        // given
        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Choupette',
            lastName: 'Eurasier',
          }
        );

        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: 'Cho ' },
        });

        // then
        expect(participations.length).to.equal(1);
        expect(participations[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search part its lastname', async function () {
        // given
        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Choupette',
            lastName: 'Eurasier',
          }
        );

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The boy',
            campaignId: campaign.id,
          },
          {
            firstName: 'Salto',
            lastName: 'Irish terrier',
          }
        );

        await databaseBuilder.commit();
        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: 'Eura' },
        });

        // then
        expect(participations.length).to.equal(1);
        expect(participations[0].lastName).to.equal('Eurasier');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search part its fullname', async function () {
        // given
        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Choupette',
            lastName: 'Eurasier',
          }
        );

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The boy',
            campaignId: campaign.id,
          },
          {
            firstName: 'Salto',
            lastName: 'Irish terrier',
          }
        );

        await databaseBuilder.commit();
        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: 'Choupette E' },
        });

        // then
        expect(participations.length).to.equal(1);
        expect(participations[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant only for the involved campaign when we search part of its full name', async function () {
        const otherCampaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill2' }]);

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Choupette',
            lastName: 'Eurasier',
          }
        );

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: otherCampaign.id,
          },
          {
            firstName: 'Choupette',
            lastName: 'Wrong',
          }
        );

        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: 'Choupette' },
        });

        // then
        expect(participations.length).to.equal(1);
        expect(participations[0].lastName).to.equal('Eurasier');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return all participants when we search similar part of firstname', async function () {
        // given
        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The boy',
            campaignId: campaign.id,
          },
          {
            firstName: 'Salto',
            lastName: 'Irish terrier',
          }
        );

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The girl',
            campaignId: campaign.id,
          },
          {
            firstName: 'Saphira',
            lastName: 'Young',
          }
        );

        await databaseBuilder.commit();
        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: 'Sa' },
        });

        // then
        expect(participations.length).to.equal(2);
        expect(participations[0].firstName).to.equal('Salto');
        expect(participations[1].firstName).to.equal('Saphira');
      });
    });
  });
});
