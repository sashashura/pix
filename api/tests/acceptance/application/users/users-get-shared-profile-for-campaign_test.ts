// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | GET /users/{userId}/campaigns/{campaignId}/profile', function () {
  const userId = 100;
  const competenceId = 'recAbe382T0e1337';
  const createdAt = new Date('2019-01-01');
  const createdAfterAt = new Date('2019-01-03');
  const sharedAt = new Date('2019-01-02');
  const pixScore = 2;

  let campaignParticipation: $TSFixMe;
  let options: $TSFixMe;
  let server: $TSFixMe;

  const learningContent = {
    areas: [
      {
        id: 'recvoGdo7z2z7pXWa',
        titleFrFr: 'Information et données',
        color: 'jaffa',
        code: '1',
        competenceIds: [competenceId],
      },
    ],
    competences: [
      {
        id: competenceId,
        nameFrFr: 'Mener une recherche et une veille d’information',
        index: '1.1',
        origin: 'Pix',
        areaId: 'recvoGdo7z2z7pXWa',
      },
    ],
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /users/{userId}/campaigns/{campaignId}/profile', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      mockLearningContent(learningContent);

      databaseBuilder.factory.buildUser({ id: userId });

      const campaign = databaseBuilder.factory.buildCampaign();
      campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        campaignId: campaign.id,
        sharedAt,
        pixScore,
      });

      const knowledgeElements = [
        { skillId: 'url1', status: 'validated', source: 'direct', competenceId, earnedPix: 2, createdAt, userId },
        {
          skillId: 'url2',
          status: 'validated',
          source: 'direct',
          competenceId,
          earnedPix: 2,
          createdAt: createdAfterAt,
          userId,
        },
      ];
      _.each(knowledgeElements, (ke: $TSFixMe) => databaseBuilder.factory.buildKnowledgeElement(ke));

      options = {
        method: 'GET',
        url: `/api/users/${userId}/campaigns/${campaign.id}/profile`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return score cards for the shared profile with 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: {
            id: String(campaignParticipation.id),
            attributes: {
              'pix-score': 2,
              'shared-at': sharedAt,
              'can-retry': false,
            },
            relationships: {
              scorecards: {
                data: [
                  {
                    id: '100_recAbe382T0e1337',
                    type: 'scorecards',
                  },
                ],
              },
            },
            type: 'SharedProfileForCampaigns',
          },
          included: [
            {
              attributes: {
                code: '1',
                color: 'jaffa',
                title: 'Information et données',
              },
              id: 'recvoGdo7z2z7pXWa',
              type: 'areas',
            },
            {
              attributes: {
                'competence-id': 'recAbe382T0e1337',
                description: undefined,
                'earned-pix': 2,
                index: '1.1',
                level: 0,
                name: 'Mener une recherche et une veille d’information',
                'pix-score-ahead-of-next-level': 2,
                status: 'STARTED',
              },
              id: '100_recAbe382T0e1337',
              relationships: {
                area: {
                  data: {
                    id: 'recvoGdo7z2z7pXWa',
                    type: 'areas',
                  },
                },
              },
              type: 'scorecards',
            },
          ],
        });
      });
    });
  });
});
