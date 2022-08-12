// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | sessions-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /sessions/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with 204', async function () {
      // given
      const server = await createServer();
      const userId = databaseBuilder.factory.buildUser().id;

      const { id: certificationCenterId, name: certificationCenter } =
        databaseBuilder.factory.buildCertificationCenter();

      const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId, certificationCenter }).id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });

      await databaseBuilder.commit();
      const options = {
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
        method: 'DELETE',
        url: `/api/sessions/${sessionId}`,
      };

      // when
      const response = await server.inject(options);

      // then

      const session = await knex('sessions').where({ id: sessionId }).first();

      expect(response.statusCode).to.equal(204);
      expect(session).to.be.undefined;
    });
  });
});
