// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Campaign Participations | Results', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/assessment-results', function () {
    const participant1 = { firstName: 'John', lastName: 'McClane', id: 12, email: 'john.mclane@die.hard' };
    const participant2 = { firstName: 'Holly', lastName: 'McClane', id: 13, email: 'holly.mclane@die.hard' };

    let campaign: $TSFixMe;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      const organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildMembership({ userId, organizationId: organization.id });

      const skill = { id: 'Skill1', name: '@Acquis1', challenges: [] };
      const learningContent = [
        {
          id: 'recArea1',
          competences: [
            {
              id: 'recCompetence1',
              tubes: [
                {
                  id: 'recTube1',
                  skills: [skill],
                },
              ],
            },
          ],
        },
      ];

      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);

      campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({ organizationId: organization.id }, [skill]);

      const campaignParticipation = {
        participantExternalId: 'Die Hard',
        sharedAt: new Date(2010, 1, 1),
        campaignId: campaign.id,
      };

      databaseBuilder.factory.buildAssessmentFromParticipation(
        campaignParticipation,
        {
          organizationId: organization.id,
          division: '5eme',
          firstName: 'John',
          lastName: 'McClane',
        },
        participant1
      );
      databaseBuilder.factory.buildAssessmentFromParticipation(
        campaignParticipation,
        {
          organizationId: organization.id,
          division: '4eme',
          firstName: 'Holly',
          lastName: 'McClane',
        },
        participant2
      );

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the participation results for an assessment campaign', async function () {
      const options = {
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/assessment-results?page[number]=1&page[size]=10&filter[divisions][]=5eme`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(200);
      const participation = response.result.data[0].attributes;
      expect(response.result.data).to.have.lengthOf(1);
      expect(participation['first-name']).to.equal(participant1.firstName);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the participation results for an assessment campaign filtered by search as JSONAPI', async function () {
      const options = {
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/assessment-results?page[number]=1&page[size]=10&filter[search]=Holly M`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(200);
      const participation = response.result.data[0].attributes;
      expect(response.result.data).to.have.lengthOf(1);
      expect(participation['first-name']).to.equal(participant2.firstName);
    });
  });
});
