// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-delete-certification-candidate', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deleteCertificationCandidate', function () {
    let sessionId: $TSFixMe;
    let userId;
    let certificationCandidateId;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser().id;
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });

      options = {
        method: 'DELETE',
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
      };
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the candidate is linked', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationCandidateId = databaseBuilder.factory.buildCertificationCandidate({ sessionId }).id;
        options.url = `/api/sessions/${sessionId}/certification-candidates/${certificationCandidateId}`;
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 403 forbidden error', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the candidate is not linked', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationCandidateId = databaseBuilder.factory.buildCertificationCandidate({ sessionId, userId: null }).id;
        options.url = `/api/sessions/${sessionId}/certification-candidates/${certificationCandidateId}`;
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 204 status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });
  });
});
