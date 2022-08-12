// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/application/http-errors');
const {
  verifyCertificationSessionAuthorization,
  verifySessionAuthorization,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/application/preHandlers/authorization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../../../lib/infrastructure/repositories/certification-course-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../../../lib/infrastructure/repositories/sessions/session-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Pre-handler | Authorization', function () {
  const userId = 1;
  const sessionId = 2;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verifySessionAuthorization', function () {
    const request = {
      auth: { credentials: { accessToken: 'valid.access.token', userId } },
      params: {
        id: sessionId,
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has access to session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with true', async function () {
        // given
        sinon.stub(sessionRepository, 'doesUserHaveCertificationCenterMembershipForSession');
        sessionRepository.doesUserHaveCertificationCenterMembershipForSession
          .withArgs(userId, sessionId)
          .resolves(true);

        // when
        const response = await verifySessionAuthorization(request);

        // then
        expect(response).to.deep.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has no access to session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // given
        sinon.stub(sessionRepository, 'doesUserHaveCertificationCenterMembershipForSession');
        sessionRepository.doesUserHaveCertificationCenterMembershipForSession
          .withArgs(userId, sessionId)
          .resolves(false);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(verifySessionAuthorization)(request);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.equal("La session n'existe pas ou son accès est restreint");
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verifyCertificationSessionAuthorization', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user is allowed to access the session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        const userId = 1;
        const certificationCourse = domainBuilder.buildCertificationCourse();
        const request = {
          auth: { credentials: { accessToken: 'valid.access.token', userId } },
          params: {
            id: certificationCourse.id,
          },
        };
        sinon.stub(certificationCourseRepository, 'get');
        sinon.stub(sessionRepository, 'doesUserHaveCertificationCenterMembershipForSession');
        certificationCourseRepository.get.resolves(certificationCourse);
        sessionRepository.doesUserHaveCertificationCenterMembershipForSession
          .withArgs(userId, certificationCourse.getSessionId())
          .resolves(true);

        // when
        const response = await verifyCertificationSessionAuthorization(request);

        // then
        expect(response).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has no access to session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // given
        const userId = 1;
        const certificationCourse = domainBuilder.buildCertificationCourse();
        const request = {
          auth: { credentials: { accessToken: 'valid.access.token', userId } },
          params: {
            id: certificationCourse.id,
          },
        };
        sinon.stub(certificationCourseRepository, 'get');
        sinon.stub(sessionRepository, 'doesUserHaveCertificationCenterMembershipForSession');
        certificationCourseRepository.get.resolves(certificationCourse);
        sessionRepository.doesUserHaveCertificationCenterMembershipForSession
          .withArgs(userId, certificationCourse.getSessionId())
          .resolves(false);
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(verifyCertificationSessionAuthorization)(request);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.equal("La session n'existe pas ou son accès est restreint");
      });
    });
  });
});
