// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stagesCont... Remove this comment to see the full error message
const stagesController = require('../../../../lib/application/stages/stages-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/stages');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Stages | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/stages', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 201', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon.stub(stagesController, 'create').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request('POST', '/api/admin/stages');

        // then
        expect(statusCode).to.equal(201);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "CERTIF"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 403', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
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
        const { statusCode } = await httpTestServer.request('POST', '/api/admin/stages');

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/stages/:id', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(stagesController, 'getStageDetails').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'GET';
      const url = '/api/admin/stages/34';

      // when
      const { statusCode } = await httpTestServer.request(method, url);

      // then
      expect(statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 400 error when the id is not a number', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'GET';
      const unknownId = 'abcd45';
      const url = `/api/admin/stages/${unknownId}`;

      // when
      const { statusCode } = await httpTestServer.request(method, url);

      // then
      expect(statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/stages/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 201', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon.stub(stagesController, 'updateStage').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request('PATCH', '/api/admin/stages/1', {
          data: {
            attributes: {
              message: null,
              'prescriber-description': null,
              'prescriber-title': null,
              threshold: null,
              title: null,
            },
          },
        });

        // then
        expect(statusCode).to.equal(201);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the stage with attributes', async function () {
        // given
        sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
        sinon.stub(stagesController, 'updateStage').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'PATCH';
        const payload = {
          data: {
            attributes: {
              threshold: 42,
              title: 'titre',
              message: 'message',
              'prescriber-title': 'test',
              'prescriber-description': 'bidule',
            },
          },
        };
        const url = '/api/admin/stages/34';

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the stage even if there is null', async function () {
        // given
        sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
        sinon.stub(stagesController, 'updateStage').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'PATCH';
        const payload = {
          data: {
            attributes: {
              threshold: 42,
              title: 'titre',
              message: null,
              'prescriber-title': null,
              'prescriber-description': 'bidule',
            },
          },
        };
        const url = '/api/admin/stages/34';

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the id is not a number', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 400 error', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const method = 'PATCH';
          const unknownId = 'abcd45';
          const payload = {
            data: {
              attributes: {
                'prescriber-title': 'test',
                'prescriber-description': 'bidule',
              },
            },
          };
          const url = `/api/admin/stages/${unknownId}`;

          // when
          const { statusCode } = await httpTestServer.request(method, url, payload);

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when payload is undefined', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 400 error', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const method = 'PATCH';
          const payload = {
            data: {
              attributes: {
                'prescriber-title': undefined,
                'prescriber-description': undefined,
              },
            },
          };
          const url = '/api/admin/stages/34';

          // when
          const { statusCode } = await httpTestServer.request(method, url, payload);

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when payload is empty strings', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 400 error', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const method = 'PATCH';
          const payload = {
            data: {
              attributes: {
                'prescriber-title': '',
                'prescriber-description': '',
              },
            },
          };
          const url = '/api/admin/stages/34';

          // when
          const { statusCode } = await httpTestServer.request(method, url, payload);

          // then
          expect(statusCode).to.equal(400);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "CERTIF"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 403', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
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
        const { statusCode } = await httpTestServer.request('PATCH', '/api/admin/stages/1', {
          data: {
            attributes: {
              message: null,
              'prescriber-description': null,
              'prescriber-title': null,
              threshold: null,
              title: null,
            },
          },
        });

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });
});
