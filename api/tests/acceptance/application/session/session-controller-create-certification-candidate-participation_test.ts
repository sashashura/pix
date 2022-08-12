// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-create-certification-candidate-participation', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCandidateParticipation', function () {
    let options: $TSFixMe;
    let payload;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser().id;
      options = {
        method: 'POST',
        url: '/api/sessions/1/candidate-participation',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not authenticated', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options = {
          method: 'POST',
          url: '/api/sessions/1/candidate-participation',
          headers: { authorization: 'invalid.access.token' },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session id is not an integer', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options = {
          method: 'POST',
          url: '/api/sessions/2.1/candidate-participation',
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 400 - Bad Request', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
        expect(response.result.errors[0].title).to.equal('Bad Request');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is authenticated', function () {
      let sessionId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: false, externalId: '123456' });
        const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
          type: 'SCO',
          externalId: '123456',
        }).id;
        sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;
        payload = {
          data: {
            attributes: {
              'first-name': 'José',
              'last-name': 'Bové',
              birthdate: '2000-01-01',
            },
            type: 'certification-candidates',
          },
        };
        options = {
          method: 'POST',
          url: `/api/sessions/${sessionId}/candidate-participation`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
          payload,
        };
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no certification candidates match with the provided info', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          _.times(
            10,
            databaseBuilder.factory.buildCertificationCandidate({ firstName: 'Alain', userId: null, sessionId })
          );
          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 404 not found error', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when more than one certification candidates match with the provided info', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          databaseBuilder.factory.buildCertificationCandidate({
            firstName: 'José',
            lastName: 'Bové',
            birthdate: '2000-01-01',
            sessionId,
            userId: null,
          });
          databaseBuilder.factory.buildCertificationCandidate({
            firstName: 'José',
            lastName: 'Bové',
            birthdate: '2000-01-01',
            sessionId,
            userId: null,
          });
          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 409 conflict error', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when one or more personal info field is missing', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          payload = {
            data: {
              attributes: {
                'first-name': 'José',
                'last-name': 'Bové',
              },
              type: 'certification-candidates',
            },
          };
          options.payload = payload;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 400 bad request error', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a unique certification candidate matches with the personal info provided', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when found certification candidate is not linked yet', function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            databaseBuilder.factory.buildCertificationCandidate({
              firstName: 'José',
              lastName: 'Bové',
              birthdate: '2000-01-01',
              sessionId,
              userId: null,
            });
            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when user already linked to another candidate in the same session', function () {
            // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
            beforeEach(function () {
              databaseBuilder.factory.buildCertificationCandidate({
                firstName: 'Noël',
                lastName: 'Mamère',
                birthdate: '1998-06-25',
                sessionId,
                userId,
              });
              return databaseBuilder.commit();
            });

            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should respond with 403 forbidden status code', async function () {
              // when
              const response = await server.inject(options);

              // then
              expect(response.statusCode).to.equal(403);
            });
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when user is not linked no any candidate in the session', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should respond with the serialized certification candidate', async function () {
              // when
              const response = await server.inject(options);

              // then
              const actualCertificationCandidateAttributes = response.result.data.attributes;
              expect(actualCertificationCandidateAttributes['first-name']).to.equal('José');
              expect(actualCertificationCandidateAttributes['last-name']).to.equal('Bové');
              expect(actualCertificationCandidateAttributes['birthdate']).to.equal('2000-01-01');
            });

            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should respond with 201 status code', async function () {
              // when
              const response = await server.inject(options);

              // then
              expect(response.statusCode).to.equal(201);
            });
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when found certification candidate is already linked', function () {
          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when the candidate is linked to the same user as the requesting user', function () {
            // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
            beforeEach(function () {
              databaseBuilder.factory.buildCertificationCandidate({
                firstName: 'José',
                lastName: 'Bové',
                birthdate: '2000-01-01',
                sessionId,
                userId,
              });
              return databaseBuilder.commit();
            });

            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should respond with the serialized certification candidate', async function () {
              // when
              const response = await server.inject(options);

              // then
              const actualCertificationCandidateAttributes = response.result.data.attributes;
              expect(actualCertificationCandidateAttributes['first-name']).to.equal('José');
              expect(actualCertificationCandidateAttributes['last-name']).to.equal('Bové');
              expect(actualCertificationCandidateAttributes['birthdate']).to.equal('2000-01-01');
            });

            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should respond with 200 status code', async function () {
              // when
              const response = await server.inject(options);

              // then
              expect(response.statusCode).to.equal(200);
            });
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when the candidate is linked to the another user than the requesting user', function () {
            // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
            beforeEach(function () {
              databaseBuilder.factory.buildCertificationCandidate({
                firstName: 'José',
                lastName: 'Bové',
                birthdate: '2000-01-01',
                sessionId,
              });
              return databaseBuilder.commit();
            });

            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should respond with 403 forbidden', async function () {
              // when
              const response = await server.inject(options);

              // then
              expect(response.statusCode).to.equal(403);
            });
          });
        });
      });
    });
  });
});
