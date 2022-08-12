// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationController = require('../../../../lib/application/certifications/certification-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/certifications');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Certification | Routes', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('POST /api/admin/certification/neutralize-challenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return forbidden access if user has METIER role', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
        .withArgs([
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
          securityPreHandlers.checkAdminMemberHasRoleCertif,
          securityPreHandlers.checkAdminMemberHasRoleSupport,
        ])
        .callsFake(
          () => (request: $TSFixMe, h: $TSFixMe) =>
            h
              .response({ errors: new Error('forbidden') })
              .code(403)
              .takeover()
        );

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/admin/certification/neutralize-challenge', {
        data: {
          attributes: {
            certificationCourseId: 1,
            challengeRecId: 'rec43mpMIR5dUzdjh',
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('checks that a valid certification-course id is given', async function () {
      // given
      sinon.stub(certificationController, 'neutralizeChallenge').returns('ok');
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          attributes: {
            certificationCourseId: 'invalide',
            challengeRecId: 'rec43mpMIR5dUzdjh',
          },
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/admin/certification/neutralize-challenge', payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('checks that a challenge recId is given', async function () {
      // given
      sinon.stub(certificationController, 'neutralizeChallenge').returns('ok');
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          attributes: {
            certificationCourseId: 1,
            challengeRecId: null,
          },
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/admin/certification/neutralize-challenge', payload);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('POST /api/admin/certification/deneutralize-challenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return forbidden access if user has METIER role', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
        .withArgs([
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
          securityPreHandlers.checkAdminMemberHasRoleCertif,
          securityPreHandlers.checkAdminMemberHasRoleSupport,
        ])
        .callsFake(
          () => (request: $TSFixMe, h: $TSFixMe) =>
            h
              .response({ errors: new Error('forbidden') })
              .code(403)
              .takeover()
        );

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/admin/certification/deneutralize-challenge', {
        data: {
          attributes: {
            certificationCourseId: 1,
            challengeRecId: 'rec43mpMIR5dUzdjh',
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('checks that a valid certification-course id is given', async function () {
      // given
      sinon.stub(certificationController, 'deneutralizeChallenge').returns('ok');
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          attributes: {
            certificationCourseId: 'invalide',
            challengeRecId: 'rec43mpMIR5dUzdjh',
          },
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/admin/certification/deneutralize-challenge', payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('checks that a challenge recId is given', async function () {
      // given
      sinon.stub(certificationController, 'deneutralizeChallenge').returns('ok');
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          attributes: {
            certificationCourseId: 1,
            challengeRecId: null,
          },
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/admin/certification/deneutralize-challenge', payload);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });
});
