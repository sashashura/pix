const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-get-campaign-participation-overviews', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /users/1/campaign-participation-overviews', function () {
    let userId: $TSFixMe;
    let options;
    let targetProfile;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const user = databaseBuilder.factory.buildUser();
      userId = user.id;

      const learningContent = [
        {
          id: 'recArea1',
          competences: [
            {
              id: 'recCompetence1',
              tubes: [
                {
                  id: 'recTube1',
                  skills: [
                    {
                      id: 'recSkillId1',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);

      targetProfile = databaseBuilder.factory.buildTargetProfile();
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: 'recSkillId1' });

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return participation which match with filters', async function () {
      // given
      const startedCampaignParticipation = databaseBuilder.factory.campaignParticipationOverviewFactory.buildOnGoing({
        userId,
        targetProfileSkills: ['recSkillId1'],
      });
      const sharableCampaignParticipation = databaseBuilder.factory.campaignParticipationOverviewFactory.buildToShare({
        userId,
        targetProfileSkills: ['recSkillId1'],
      });
      databaseBuilder.factory.campaignParticipationOverviewFactory.buildEnded({
        userId,
        targetProfileSkills: ['recSkillId1'],
      });

      await databaseBuilder.commit();
      options = {
        method: 'GET',
        url: `/api/users/${userId}/campaign-participation-overviews?filter[states][]=ONGOING&filter[states][]=TO_SHARE`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      const participationIds = response.result.data.map(({
        id
      }: $TSFixMe) => Number(id));
      expect(participationIds).to.deep.equals([sharableCampaignParticipation.id, startedCampaignParticipation.id]);
    });
  });
});
