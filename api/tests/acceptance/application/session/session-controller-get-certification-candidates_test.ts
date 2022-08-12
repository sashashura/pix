// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-get-certification-candidates', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /sessions/{id}/certification-candidates', function () {
    let sessionId: $TSFixMe;
    let userId: $TSFixMe;
    let certificationCenterId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      ({ id: sessionId, certificationCenterId } = databaseBuilder.factory.buildSession());

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has no access to session resources', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userId = databaseBuilder.factory.buildUser().id;
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 404 HTTP status code (to keep opacity on whether forbidden or not found)', async function () {
        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/sessions/${sessionId}/certification-candidates`,
          payload: {},
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(response.statusCode).to.equal(404);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has access to session resources', function () {
      let expectedCertificationCandidateAAttributes: $TSFixMe;
      let expectedCertificationCandidateBAttributes: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const certificationCandidateA = databaseBuilder.factory.buildCertificationCandidate({
          lastName: 'A',
          sessionId,
        });
        const certificationCandidateB = databaseBuilder.factory.buildCertificationCandidate({
          lastName: 'B',
          sessionId,
        });
        _.times(5, databaseBuilder.factory.buildCertificationCandidate());
        expectedCertificationCandidateAAttributes = {
          'first-name': certificationCandidateA.firstName,
          'last-name': certificationCandidateA.lastName,
          'billing-mode': '',
          'prepayment-code': null,
          birthdate: certificationCandidateA.birthdate,
          'birth-city': certificationCandidateA.birthCity,
          'birth-province-code': certificationCandidateA.birthProvinceCode,
          'birth-country': certificationCandidateA.birthCountry,
          email: certificationCandidateA.email,
          'result-recipient-email': certificationCandidateA.resultRecipientEmail,
          'external-id': certificationCandidateA.externalId,
          'extra-time-percentage': certificationCandidateA.extraTimePercentage,
          'is-linked': true,
          'schooling-registration-id': null,
          'organization-learner-id': null,
          sex: certificationCandidateA.sex,
          'birth-insee-code': certificationCandidateA.birthINSEECode,
          'birth-postal-code': certificationCandidateA.birthPostalCode,
          'complementary-certifications': [],
        };
        expectedCertificationCandidateBAttributes = {
          'first-name': certificationCandidateB.firstName,
          'last-name': certificationCandidateB.lastName,
          'billing-mode': '',
          'prepayment-code': null,
          birthdate: certificationCandidateB.birthdate,
          'birth-city': certificationCandidateB.birthCity,
          'birth-province-code': certificationCandidateB.birthProvinceCode,
          'birth-country': certificationCandidateB.birthCountry,
          email: certificationCandidateB.email,
          'result-recipient-email': certificationCandidateB.resultRecipientEmail,
          'external-id': certificationCandidateB.externalId,
          'extra-time-percentage': certificationCandidateB.extraTimePercentage,
          'is-linked': true,
          'schooling-registration-id': null,
          'organization-learner-id': null,
          sex: certificationCandidateB.sex,
          'birth-insee-code': certificationCandidateB.birthINSEECode,
          'birth-postal-code': certificationCandidateB.birthPostalCode,
          'complementary-certifications': [],
        };
        userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/sessions/${sessionId}/certification-candidates`,
          payload: {},
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the expected data', async function () {
        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/sessions/${sessionId}/certification-candidates`,
          payload: {},
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(response.result.data[0].attributes).to.deep.equal(expectedCertificationCandidateAAttributes);
        expect(response.result.data[1].attributes).to.deep.equal(expectedCertificationCandidateBAttributes);
      });
    });
  });
});
