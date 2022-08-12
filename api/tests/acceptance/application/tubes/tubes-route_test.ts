const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Tubes', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/tubes/{id}/skills', function () {
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser.withRole().id;

      await databaseBuilder.commit();
      mockLearningContent({
        tubes: [
          {
            id: 'tubeId1',
          },
          {
            id: 'tubeId2',
          },
        ],
        skills: [
          {
            id: 'skillId1',
            status: 'actif',
            tubeId: 'tubeId1',
            level: 1,
          },
          {
            id: 'skillId2',
            status: 'actif',
            tubeId: 'tubeId1',
            level: 2,
          },
          {
            id: 'skillId3',
            status: 'archivé',
            tubeId: 'tubeId1',
            level: 3,
          },
          {
            id: 'skillId4',
            status: 'supprimé',
            tubeId: 'tubeId1',
            level: 4,
          },
          {
            id: 'skillId5',
            status: 'actif',
            tubeId: 'tubeId2',
            level: 5,
          },
        ],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return response code 200', async function () {
      // given
      const options = {
        method: 'GET',
        url: `/api/admin/tubes/tubeId1/skills`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return list of tube's skills", async function () {
      // given
      const options = {
        method: 'GET',
        url: `/api/admin/tubes/tubeId1/skills`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.have.lengthOf(2);
      expect(response.result.data).to.deep.include({
        id: 'skillId1',
        type: 'skills',
        attributes: {
          level: 1,
        },
      });
      expect(response.result.data).to.deep.include({
        id: 'skillId2',
        type: 'skills',
        attributes: {
          level: 2,
        },
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('if user is not super admin', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return response code 403', async function () {
        // given
        userId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();
        const options = {
          method: 'GET',
          url: `/api/admin/tubes/123/skills`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
