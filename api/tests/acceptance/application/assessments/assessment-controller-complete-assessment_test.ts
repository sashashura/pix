// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../../../lib/infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | assessment-controller-complete-assessment', function () {
  let options: $TSFixMe;
  let server: $TSFixMe;
  let user: $TSFixMe, assessment;
  const learningContent = [
    {
      id: 'recArea0',
      competences: [
        {
          id: 'recCompetence0',
          tubes: [
            {
              id: 'recTube0_0',
              skills: [
                {
                  id: 'recSkill0_0',
                  nom: '@recSkill0_0',
                  challenges: [{ id: 'recChallenge0_0_0' }],
                },
                {
                  id: 'recSkill0_1',
                  nom: '@recSkill0_1',
                  challenges: [{ id: 'recChallenge0_1_0' }],
                },
                {
                  id: 'recSkill0_2',
                  nom: '@recSkill0_2',
                  challenges: [{ id: 'recChallenge0_2_0' }],
                },
              ],
            },
          ],
        },
        {
          id: 'recCompetence1',
          tubes: [
            {
              id: 'recTube1_0',
              skills: [
                {
                  id: 'recSkill1_0',
                  nom: '@recSkill1_0',
                  challenges: [{ id: 'recChallenge1_0_0' }],
                },
                {
                  id: 'recSkill1_1',
                  nom: '@recSkill1_1',
                  challenges: [{ id: 'recChallenge1_1_0' }],
                },
                {
                  id: 'recSkill1_2',
                  nom: '@recSkill1_2',
                  challenges: [{ id: 'recChallenge1_2_0' }],
                },
              ],
            },
          ],
        },
        {
          id: 'recCompetence2',
          tubes: [
            {
              id: 'recTube2_0',
              skills: [
                {
                  id: 'recSkill2_0',
                  nom: '@recSkill2_0',
                  challenges: [{ id: 'recChallenge2_0_0' }],
                },
                {
                  id: 'recSkill2_1',
                  nom: '@recSkill2_1',
                  challenges: [{ id: 'recChallenge2_1_0' }],
                },
                {
                  id: 'recSkill2_2',
                  nom: '@recSkill2_2',
                  challenges: [{ id: 'recChallenge2_2_0' }],
                },
              ],
            },
          ],
        },
        {
          id: 'recCompetence3',
          tubes: [
            {
              id: 'recTube3_0',
              skills: [
                {
                  id: 'recSkill3_0',
                  nom: '@recSkill3_0',
                  challenges: [{ id: 'recChallenge3_0_0' }],
                },
                {
                  id: 'recSkill3_1',
                  nom: '@recSkill3_1',
                  challenges: [{ id: 'recChallenge3_1_0' }],
                },
                {
                  id: 'recSkill3_2',
                  nom: '@recSkill3_2',
                  challenges: [{ id: 'recChallenge3_2_0' }],
                },
              ],
            },
          ],
        },
        {
          id: 'recCompetence4',
          tubes: [
            {
              id: 'recTube4_0',
              skills: [
                {
                  id: 'recSkill4_0',
                  nom: '@recSkill4_0',
                  challenges: [{ id: 'recChallenge4_0_0' }],
                },
                {
                  id: 'recSkill4_1',
                  nom: '@recSkill4_1',
                  challenges: [{ id: 'recChallenge4_1_0' }],
                },
                {
                  id: 'recSkill4_2',
                  nom: '@recSkill4_2',
                  challenges: [{ id: 'recChallenge4_2_0' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
    mockLearningContent(learningContentObjects);

    server = await createServer();

    user = databaseBuilder.factory.buildUser({});
    assessment = databaseBuilder.factory.buildAssessment({
      userId: user.id,
      state: Assessment.states.STARTED,
    });

    await databaseBuilder.commit();

    options = {
      method: 'PATCH',
      url: `/api/assessments/${assessment.id}/complete-assessment`,
      headers: {
        authorization: generateValidRequestAuthorizationHeader(user.id),
      },
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    return knex('assessment-results').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /assessments/{id}/complete-assessment', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not the owner of the assessment', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 401 HTTP status code', async function () {
        // given
        options.headers.authorization = generateValidRequestAuthorizationHeader(user.id + 1);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is the owner of the assessment', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should complete the assessment', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment belongs to a campaign', function () {
      let user: $TSFixMe;
      let targetProfile: $TSFixMe;
      let badge: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        user = databaseBuilder.factory.buildUser({});
        targetProfile = databaseBuilder.factory.buildTargetProfile();
        badge = databaseBuilder.factory.buildBadge({ targetProfileId: targetProfile.id });
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        await knex('badge-acquisitions').delete();
        await knex('badge-criteria').delete();
        await knex('badges').delete();
        await knex('knowledge-elements').delete();
        await knex('assessment-results').delete();
        await knex('answers').delete();
        await knex('assessments').delete();
        await knex('campaign-participations').delete();
        await knex('campaigns').delete();
        await knex('target-profiles_skills').delete();
        await knex('target-profiles').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a badge when it is acquired', async function () {
        // given
        const campaign = databaseBuilder.factory.buildCampaign({
          targetProfileId: targetProfile.id,
        });

        // when
        await _createAndCompleteCampaignParticipation({
          user,
          campaign,
          badge,
          options,
          server,
        });

        // then
        const badgeAcquiredIds = await badgeAcquisitionRepository.getAcquiredBadgeIds({
          badgeIds: [badge.id],
          userId: user.id,
        });
        expect(badgeAcquiredIds).to.deep.equal([badge.id]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a second badge when it is acquired in another campaign participation', async function () {
        // given
        const firstCampaign = databaseBuilder.factory.buildCampaign({
          targetProfileId: targetProfile.id,
        });
        const secondCampaign = databaseBuilder.factory.buildCampaign({
          targetProfileId: targetProfile.id,
        });

        await _createAndCompleteCampaignParticipation({
          user,
          campaign: firstCampaign,
          badge,
          options,
          server,
        });

        // when
        await _createAndCompleteCampaignParticipation({
          user,
          campaign: secondCampaign,
          badge,
          options,
          server,
        });

        // then
        const badgeAcquisitions = await knex('badge-acquisitions').where({
          badgeId: badge.id,
          userId: user.id,
        });

        expect(badgeAcquisitions).to.have.lengthOf(2);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is of type certification', function () {
      let certifiableUserId: $TSFixMe;
      let certificationAssessmentId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const limitDate = new Date('2020-01-01T00:00:00Z');
        certifiableUserId = databaseBuilder.factory.buildUser().id;

        const competenceIdSkillIdPairs =
          databaseBuilder.factory.buildCorrectAnswersAndKnowledgeElementsForLearningContent({
            learningContent,
            userId: certifiableUserId,
            placementDate: limitDate,
            earnedPix: 8,
          });

        certificationAssessmentId = databaseBuilder.factory.buildAnsweredNotCompletedCertificationAssessment({
          certifiableUserId,
          competenceIdSkillIdPairs,
          limitDate: moment(limitDate).add(1, 'day').toDate(),
        }).id;
        const badgeId = databaseBuilder.factory.buildBadge({ key: Badge.keys.PIX_EMPLOI_CLEA_V3 }).id;
        databaseBuilder.factory.buildSkillSet({
          badgeId,
          skillIds: ['recSkill0_0'],
        });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        await knex('complementary-certification-course-results').delete();
        await knex('competence-marks').delete();
        await knex('assessment-results').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should complete the certification assessment', async function () {
        // given
        options.url = `/api/assessments/${certificationAssessmentId}/complete-assessment`;
        options.headers.authorization = generateValidRequestAuthorizationHeader(certifiableUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });
  });
});

async function _createAndCompleteCampaignParticipation({
  user,
  campaign,
  badge,
  options,
  server
}: $TSFixMe) {
  const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
    campaignId: campaign.id,
    userId: user.id,
  });
  const campaignAssessment = databaseBuilder.factory.buildAssessment({
    type: 'CAMPAIGN',
    state: Assessment.states.STARTED,
    userId: user.id,
    campaignParticipationId: campaignParticipation.id,
  });
  const anyDateBeforeCampaignParticipation = new Date(campaignParticipation.sharedAt.getTime() - 60 * 1000);

  databaseBuilder.factory.buildTargetProfileSkill({
    targetProfileId: campaign.targetProfileId,
    skillId: 'recSkill0_0',
  });
  databaseBuilder.factory.buildKnowledgeElement({
    skillId: 'recSkill0_0',
    assessmentId: campaignAssessment.id,
    userId: user.id,
    competenceId: 'recCompetence0',
    createdAt: anyDateBeforeCampaignParticipation,
  });
  databaseBuilder.factory.buildBadgeCriterion({
    threshold: 75,
    badgeId: badge.id,
  });

  await databaseBuilder.commit();

  options.url = `/api/assessments/${campaignAssessment.id}/complete-assessment`;
  options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
  await server.inject(options);
}
