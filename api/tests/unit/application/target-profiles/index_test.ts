// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileController = require('../../../../lib/application/target-profiles/target-profile-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/target-profiles');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Target Profiles | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/target-profiles', function () {
    const method = 'GET';
    const url = '/api/admin/target-profiles';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'findPaginatedFilteredTargetProfiles')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(200);
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
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no filter nor pagination', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve with HTTP code 200', async function () {
        // given
        sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
        sinon
          .stub(targetProfileController, 'findPaginatedFilteredTargetProfiles')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are filters and pagination', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve with HTTP code 200', async function () {
        // given
        sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
        sinon
          .stub(targetProfileController, 'findPaginatedFilteredTargetProfiles')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request(
          method,
          `${url}?filter[id]=1&filter[name]=azerty&page[size]=10&page[number]=1`
        );

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject request with HTTP code 400', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request(method, `${url}?filter[id]=azerty`);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when page size is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject request with HTTP code 400', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request(method, `${url}?page[size]=azerty`);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when page number is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject request with HTTP code 400', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request(method, `${url}?page[number]=azerty`);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/target-profiles/{id}', function () {
    const method = 'GET';
    const url = '/api/admin/target-profiles/1';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT", "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'getTargetProfileDetails')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when target profile ID is invalid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, '/api/admin/target-profiles/azerty');

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
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/target-profiles/{id}/organizations', function () {
    const method = 'GET';
    const url = '/api/admin/target-profiles/1/organizations';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'findPaginatedFilteredTargetProfileOrganizations')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is no filter nor pagination', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve with an HTTP status code 200', async function () {
          // given
          sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
          sinon
            .stub(targetProfileController, 'findPaginatedFilteredTargetProfileOrganizations')
            .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, url);

          // then
          expect(statusCode).to.equal(200);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are filters and pagination', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve with an HTTP status code 200', async function () {
          // given
          sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
          sinon
            .stub(targetProfileController, 'findPaginatedFilteredTargetProfileOrganizations')
            .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(
            method,
            `${url}?filter[name]=azerty&filter[type]=sco&filter[external-id]=abc&page[size]=10&page[number]=1`
          );

          // then
          expect(statusCode).to.equal(200);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id is not an integer', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(
            method,
            '/api/admin/target-profiles/azerty/organizations'
          );

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when page size is not an integer', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, `${url}?page[size]=azerty`);

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when page number is not an integer', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, `${url}?page[number]=azerty`);

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
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/target-profiles/{id}/stages', function () {
    const method = 'GET';
    const url = '/api/admin/target-profiles/1/stages';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'findByTargetProfileId')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id is not an integer', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, '/api/admin/target-profiles/azerty/stages');

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
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/target-profiles/{id}/badges', function () {
    const method = 'GET';
    const url = '/api/admin/target-profiles/1/badges';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'findTargetProfileBadges')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id is not an integer', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, '/api/admin/target-profiles/azerty/badges');

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
        const { statusCode } = await httpTestServer.request(method, url);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/target-profiles', function () {
    const method = 'POST';
    const url = '/api/admin/target-profiles';
    const payload = {
      data: {
        attributes: {
          name: 'MyTargetProfile',
          'owner-organization-id': null,
          'image-url': null,
          'is-public': false,
          'skill-ids': ['skill1', 'skill2'],
          comment: 'comment',
          description: 'description',
          'tubes-selection': [
            {
              id: 'tube1',
              level: 7,
            },
          ],
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'createTargetProfile')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve with owner organization id to null', async function () {
        // given
        sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
        sinon
          .stub(targetProfileController, 'createTargetProfile')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, {
          data: {
            attributes: {
              name: 'MyTargetProfile',
              'owner-organization-id': null,
              'image-url': null,
              'is-public': false,
              'skill-ids': ['skill1', 'skill2'],
              comment: 'comment',
              description: 'description',
              'tubes-selection': [
                {
                  id: 'tube1',
                  level: 7,
                },
              ],
            },
          },
        });

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with alphanumeric owner organization id ', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, {
          data: {
            attributes: {
              name: 'MyTargetProfile',
              'owner-organization-id': 'ABC',
              'image-url': null,
              'is-public': false,
              'skill-ids': ['skill1', 'skill2'],
              comment: 'comment',
              description: 'description',
              'tubes-selection': [
                {
                  id: 'tube1',
                  level: 7,
                },
              ],
            },
          },
        });

        // then
        expect(statusCode).to.equal(400);
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
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/target-profiles/{id}/attach-organizations', function () {
    const method = 'POST';
    const url = '/api/admin/target-profiles/3/attach-organizations';
    const payload = { 'organization-ids': [1, 2] };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 204', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'attachOrganizations')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id is a string', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(
            method,
            '/api/admin/target-profiles/azerty/attach-organizations',
            payload
          );

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when organization-ids is not an array', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, url, { 'organization-ids': {} });

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when organization-ids is an array of string', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, url, { 'organization-ids': ['azerty'] });

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
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/target-profiles/{id}/copy-organizations', function () {
    const method = 'POST';
    const url = '/api/admin/target-profiles/3/copy-organizations';
    const payload = { 'target-profile-id': 1 };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 204', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'attachOrganizationsFromExistingTargetProfile')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(204);
        sinon.assert.calledOnce(targetProfileController.attachOrganizationsFromExistingTargetProfile);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id is a string', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(
            method,
            '/api/admin/target-profiles/azerty/copy-organizations',
            payload
          );

          // then
          expect(statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when target profile id is a string', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, url, { 'target-profile-id': 'azerty' });

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
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/target-profiles/{id}/badges', function () {
    const method = 'POST';
    const url = '/api/admin/target-profiles/123/badges';
    const payload = {
      data: {
        type: 'badges',
        attributes: {
          key: 'KEY',
          'alt-message': 'alt-message',
          'image-url': 'https://example.net/image.svg',
          message: 'message',
          title: 'title',
          'is-certifiable': false,
          'is-always-visible': true,
        },
      },
    };

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
        sinon.stub(targetProfileController, 'createBadge').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(201);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when request payload has wrong format', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 400 HTTP response', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, url, { data: { attributes: {} } });

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
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/target-profiles/{id}', function () {
    const method = 'PATCH';
    const url = '/api/admin/target-profiles/123';
    const payload = {
      data: {
        attributes: {
          name: 'test',
          description: 'description changée.',
          comment: 'commentaire changé.',
          category: 'OTHER',
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 204', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'updateTargetProfile')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 400 error when description is over than 500 characters', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        const description = 'description changée.';
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, {
          data: {
            attributes: {
              name: 'test',
              description: description.repeat(26),
              comment: null,
            },
          },
        });

        // then
        expect(statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 400 error when comment is over than 500 characters', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        const comment = 'commentaire changé.';
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, {
          data: {
            attributes: {
              name: 'test',
              description: 'good',
              comment: comment.repeat(27),
            },
          },
        });

        // then
        expect(statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 400 error when the name is not defined', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, {
          data: {
            attributes: {
              name: undefined,
            },
          },
        });

        // then
        expect(statusCode).to.equal(400);
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
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/admin/target-profiles/{id}/outdate', function () {
    const method = 'PUT';
    const url = '/api/admin/target-profiles/123/outdate';
    const payload = {};

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 204', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'outdateTargetProfile')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when target profile ID is invalid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(method, '/api/admin/target-profiles/azerty/outdate');

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
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/admin/target-profiles/{id}/simplified-access', function () {
    const method = 'PUT';
    const url = '/api/admin/target-profiles/123/simplified-access';
    const payload = {};

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role "SUPER_ADMIN", "SUPPORT" or "METIER"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a response with an HTTP status code 200', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
          .withArgs([
            securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            securityPreHandlers.checkAdminMemberHasRoleSupport,
            securityPreHandlers.checkAdminMemberHasRoleMetier,
          ])
          .callsFake(() => (request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(targetProfileController, 'markTargetProfileAsSimplifiedAccess')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when target profile ID is invalid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject request with HTTP code 400', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const { statusCode } = await httpTestServer.request(
            method,
            '/api/admin/target-profiles/azerty/simplified-access'
          );

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
        const { statusCode } = await httpTestServer.request(method, url, payload);

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });
});
