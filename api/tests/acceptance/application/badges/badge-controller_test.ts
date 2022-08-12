// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Badges', function () {
  let server: $TSFixMe, options, userId: $TSFixMe, badge: $TSFixMe, badgeCriterion: $TSFixMe, skillSet: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/badges/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = (await insertUserWithRoleSuperAdmin()).id;

      const learningContent = [
        {
          id: 'recArea',
          competences: [
            {
              id: 'recCompetence',
              tubes: [
                {
                  id: 'recTube',
                  name: '@recSkill',
                  practicalTitle: 'Titre pratique',
                  skills: [
                    {
                      id: 'recABC123',
                      nom: '@recSkill3',
                    },
                    {
                      id: 'recDEF456',
                      nom: '@recSkill2',
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

      badge = databaseBuilder.factory.buildBadge({
        id: 1,
        altMessage: 'Message alternatif',
        imageUrl: 'url_image',
        message: 'Bravo',
        title: 'titre du badge',
        key: 'clef du badge',
        isCertifiable: false,
        isAlwaysVisible: true,
      });
      badgeCriterion = databaseBuilder.factory.buildBadgeCriterion({ badgeId: badge.id });
      skillSet = databaseBuilder.factory.buildSkillSet({ badgeId: badge.id });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the badge', async function () {
      // given
      options = {
        method: 'GET',
        url: `/api/admin/badges/${badge.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
      const expectedBadge = {
        data: {
          type: 'badges',
          id: badge.id.toString(),
          attributes: {
            'alt-message': 'Message alternatif',
            'is-certifiable': false,
            'is-always-visible': true,
            'image-url': 'url_image',
            message: 'Bravo',
            title: 'titre du badge',
            key: 'clef du badge',
          },
          relationships: {
            'badge-criteria': {
              data: [
                {
                  id: badgeCriterion.id.toString(),
                  type: 'badge-criteria',
                },
              ],
            },
            'skill-sets': {
              data: [
                {
                  id: skillSet.id.toString(),
                  type: 'skill-sets',
                },
              ],
            },
            'badge-partner-competences': {
              data: [
                {
                  id: skillSet.id.toString(),
                  type: 'badge-partner-competences',
                },
              ],
            },
          },
        },
        included: [
          {
            type: 'badge-criteria',
            id: badgeCriterion.id.toString(),
            attributes: {
              scope: 'CampaignParticipation',
              threshold: 50,
            },
            relationships: {
              'skill-sets': {
                data: [],
              },
              'partner-competences': {
                data: [],
              },
            },
          },
          {
            attributes: {
              'practical-title': 'Titre pratique',
            },
            id: 'recTube',
            type: 'tubes',
            relationships: {},
          },
          {
            attributes: {
              name: '@recSkill3',
              difficulty: 3,
            },
            id: 'recABC123',
            type: 'skills',
            relationships: {
              tube: {
                data: {
                  id: 'recTube',
                  type: 'tubes',
                },
              },
            },
          },
          {
            attributes: {
              name: '@recSkill2',
              difficulty: 2,
            },
            id: 'recDEF456',
            type: 'skills',
            relationships: {
              tube: {
                data: {
                  id: 'recTube',
                  type: 'tubes',
                },
              },
            },
          },
          {
            type: 'skill-sets',
            id: skillSet.id.toString(),
            attributes: {
              name: 'name',
            },
            relationships: {
              skills: {
                data: [
                  {
                    id: 'recABC123',
                    type: 'skills',
                  },
                  {
                    id: 'recDEF456',
                    type: 'skills',
                  },
                ],
              },
            },
          },
          {
            type: 'badge-partner-competences',
            id: skillSet.id.toString(),
            attributes: {
              name: 'name',
            },
            relationships: {
              skills: {
                data: [
                  {
                    id: 'recABC123',
                    type: 'skills',
                  },
                  {
                    id: 'recDEF456',
                    type: 'skills',
                  },
                ],
              },
            },
          },
        ],
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal(expectedBadge);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/badges/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = (await insertUserWithRoleSuperAdmin()).id;

      badge = databaseBuilder.factory.buildBadge({
        id: 1,
        altMessage: 'Message alternatif',
        imageUrl: 'url_image',
        message: 'Bravo',
        title: 'titre du badge',
        key: 'clef du badge',
        isCertifiable: false,
        isAlwaysVisible: true,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('badges').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the existing badge', async function () {
      // given
      const badgeWithUpdatedInfo = {
        key: '1',
        title: 'titre du badge modifié',
        message: 'Message modifié',
        'alt-message': 'Message alternatif modifié',
        'image-url': 'url_image_modifiée',
        'is-certifiable': true,
        'is-always-visible': true,
        'campaign-threshold': null,
        'skill-set-threshold': null,
        'skill-set-name': '',
        'skill-set-skills-ids': null,
      };

      options = {
        method: 'PATCH',
        url: `/api/admin/badges/${badge.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        payload: {
          data: {
            id: '1',
            type: 'badges',
            attributes: badgeWithUpdatedInfo,
            relationships: {
              'target-profile': {
                data: {
                  id: badge.targetProfileId,
                  type: 'target-profiles',
                },
              },
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/admin/badges/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = (await insertUserWithRoleSuperAdmin()).id;
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('badge-acquisitions').delete();
      await knex('badges').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the existing badge if not associated to a badge acquisition', async function () {
      // given
      badge = databaseBuilder.factory.buildBadge({ id: 1 });
      await databaseBuilder.commit();

      options = {
        method: 'DELETE',
        url: `/api/admin/badges/${badge.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not delete the existing badge if associated to a badge acquisition', async function () {
      // given
      badge = databaseBuilder.factory.buildBadge({ id: 1 });
      databaseBuilder.factory.buildBadgeAcquisition({ badgeId: badge.id, userId });
      await databaseBuilder.commit();

      options = {
        method: 'DELETE',
        url: `/api/admin/badges/${badge.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });
});
