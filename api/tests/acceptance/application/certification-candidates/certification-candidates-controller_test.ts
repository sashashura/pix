// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertification = require('../../../../lib/domain/models/ComplementaryCertification');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Certifications candidates', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-candidates/:id/authorize-to-start', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the certification center has the supervisor access enabled', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the user is the supervisor of the session', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a 204 status code', async function () {
            // given
            const server = await createServer();
            const candidateUserId = databaseBuilder.factory.buildUser({}).id;
            const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
              isSupervisorAccessEnabled: true,
            });
            const sessionId = databaseBuilder.factory.buildSession({
              publishedAt: null,
              certificationCenterId: certificationCenter.id,
            }).id;
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
              sessionId,
              userId: candidateUserId,
            }).id;
            const candidate = databaseBuilder.factory.buildCertificationCandidate({
              id: 1001,
              sessionId,
              userId: candidateUserId,
            });
            databaseBuilder.factory.buildAssessment({
              state: 'started',
              userId: candidateUserId,
              type: 'CERTIFICATION',
              certificationCourseId,
            });

            const supervisorUserId = databaseBuilder.factory.buildUser({}).id;
            databaseBuilder.factory.buildSupervisorAccess({
              userId: supervisorUserId,
              sessionId,
            });

            await databaseBuilder.commit();

            const options = {
              method: 'POST',
              url: `/api/certification-candidates/${candidate.id}/authorize-to-start`,
              headers: { authorization: generateValidRequestAuthorizationHeader(supervisorUserId, 'pix-certif') },
              payload: { 'authorized-to-start': true },
            };

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(204);
          });
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-candidates/:id/authorize-to-resume', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the certification center has the supervisor access enabled', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the user is the supervisor of the session', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a 204 status code', async function () {
            // given
            const server = await createServer();
            const candidateUserId = databaseBuilder.factory.buildUser().id;
            const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
              isSupervisorAccessEnabled: true,
            });
            const sessionId = databaseBuilder.factory.buildSession({
              publishedAt: null,
              certificationCenterId: certificationCenter.id,
            }).id;
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
              sessionId,
              userId: candidateUserId,
            }).id;
            const candidate = databaseBuilder.factory.buildCertificationCandidate({
              id: 1001,
              sessionId,
              userId: candidateUserId,
            });
            databaseBuilder.factory.buildAssessment({
              state: 'started',
              userId: candidateUserId,
              type: 'CERTIFICATION',
              certificationCourseId,
            });

            const supervisorUserId = databaseBuilder.factory.buildUser({}).id;
            databaseBuilder.factory.buildSupervisorAccess({
              userId: supervisorUserId,
              sessionId,
            });

            await databaseBuilder.commit();

            const options = {
              method: 'POST',
              url: `/api/certification-candidates/${candidate.id}/authorize-to-resume`,
              headers: { authorization: generateValidRequestAuthorizationHeader(supervisorUserId, 'pix-certif') },
            };

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(204);
          });
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/certification-candidates/{id}/end-assessment-by-supervisor', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the certification center has the supervisor access enabled', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the user is the supervisor of the session', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a 204 status code', async function () {
            // given
            const server = await createServer();
            const candidateUserId = databaseBuilder.factory.buildUser({}).id;
            const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
              isSupervisorAccessEnabled: true,
            });
            const sessionId = databaseBuilder.factory.buildSession({
              certificationCenterId: certificationCenter.id,
            }).id;
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
              sessionId,
              userId: candidateUserId,
            }).id;
            databaseBuilder.factory.buildCertificationCandidate({
              id: 1001,
              sessionId,
              userId: candidateUserId,
            });
            databaseBuilder.factory.buildAssessment({
              state: 'started',
              userId: candidateUserId,
              type: 'CERTIFICATION',
              certificationCourseId,
            });

            const supervisorUserId = databaseBuilder.factory.buildUser({}).id;
            databaseBuilder.factory.buildSupervisorAccess({
              userId: supervisorUserId,
              sessionId,
            });

            await databaseBuilder.commit();
            const options = {
              method: 'PATCH',
              url: `/api/certification-candidates/1001/end-assessment-by-supervisor`,
              headers: { authorization: generateValidRequestAuthorizationHeader(supervisorUserId, 'pix-certif') },
            };

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(204);
          });
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certification-candidates/:id/subscriptions', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the certification candidate subscriptions', async function () {
      // given
      const server = await createServer();
      const userId = databaseBuilder.factory.buildUser().id;
      const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
      const session = databaseBuilder.factory.buildSession({
        certificationCenterId: certificationCenter.id,
      });
      const candidate = databaseBuilder.factory.buildCertificationCandidate({
        sessionId: session.id,
      });

      const cleaComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        key: ComplementaryCertification.CLEA,
        label: 'CléA Numérique',
      });
      const pixPlusDroitComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        key: ComplementaryCertification.PIX_PLUS_DROIT,
        label: 'Pix+ Droit',
      });
      databaseBuilder.factory.buildComplementaryCertificationSubscription({
        certificationCandidateId: candidate.id,
        complementaryCertificationId: cleaComplementaryCertification.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationSubscription({
        certificationCandidateId: candidate.id,
        complementaryCertificationId: pixPlusDroitComplementaryCertification.id,
      });
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/api/certification-candidates/${candidate.id}/subscriptions`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId, 'pix-certif') },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal({
        id: `${candidate.id}`,
        type: 'certification-candidate-subscriptions',
        attributes: {
          'session-id': session.id,
          'eligible-subscriptions': [],
          'non-eligible-subscriptions': [
            {
              id: cleaComplementaryCertification.id,
              label: 'CléA Numérique',
              key: ComplementaryCertification.CLEA,
            },
            {
              id: pixPlusDroitComplementaryCertification.id,
              label: 'Pix+ Droit',
              key: ComplementaryCertification.PIX_PLUS_DROIT,
            },
          ],
        },
      });
    });
  });
});
