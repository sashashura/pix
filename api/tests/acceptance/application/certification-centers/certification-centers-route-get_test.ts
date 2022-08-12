// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Application | Certification-centers | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certification-centers/{certificationCenterId}/members', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 http status code', async function () {
      // given
      const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
      const certificationCenterMember = databaseBuilder.factory.buildUser();
      const user2 = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: certificationCenter.id,
        userId: certificationCenterMember.id,
      });
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: certificationCenter.id,
        userId: user2.id,
      });
      await databaseBuilder.commit();
      const server = await createServer();

      const options = {
        headers: {
          authorization: generateValidRequestAuthorizationHeader(certificationCenterMember.id),
        },
        method: 'GET',
        url: `/api/certification-centers/${certificationCenter.id}/members`,
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data[0].id).to.equal(certificationCenterMember.id.toString());
      expect(response.result.data[1].id).to.equal(user2.id.toString());
    });
  });
});
