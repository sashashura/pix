// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationController = require('../../../../lib/application/organizations/organization-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../../../lib/domain/types/identifiers-type');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/organizations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationPlacesCategories = require('../../../../lib/domain/constants/organization-places-categories');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | organization-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/organizations', function () {
    const method = 'GET';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return OK (200) when request is valid', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(organizationController, 'findPaginatedFilteredOrganizations').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // given
      const url = '/api/admin/organizations?filter[id]=&filter[name]=DRA&filter[type]=SCO&page[number]=3&page[size]=25';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when request is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return BadRequest (400) if id is not numeric', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const idNotNumeric = 'foo';
        const url = `/api/admin/organizations?filter[id]=${idNotNumeric}`;

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id is outside number limits', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return HTTP statusCode 400 if id number is less than the minimum value', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const minNumberLimit = identifiersType.positiveInteger32bits.min;
          const wrongNumber = minNumberLimit - 1;
          const url = `/api/admin/organizations?filter[id]=${wrongNumber}`;

          // when
          const response = await httpTestServer.request(method, url);

          // then
          expect(response.statusCode).to.equal(400);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return HTTP statusCode 400 if id number is greater than the maximum value', async function () {
          // given
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const maxNumberLimit = identifiersType.positiveInteger32bits.max;
          const wrongNumber = maxNumberLimit + 1;
          const url = `/api/admin/organizations?filter[id]=${wrongNumber}`;

          // when
          const response = await httpTestServer.request(method, url);

          // then
          expect(response.statusCode).to.equal(400);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/organizations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/admin/organizations', {
        data: {
          type: 'organizations',
          attributes: {
            name: 'Super Tag',
            type: 'SCO',
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/organizations/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/admin/organizations/1', {
        data: {
          id: '1',
          type: 'organizations',
          attributes: {
            name: 'Super Tag',
            type: 'SCO',
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/organizations/{id}/archive', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(organizationController, 'archiveOrganization').resolves('ok');

      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/admin/organizations/1/archive');

      // then
      expect(response.statusCode).to.equal(403);
      sinon.assert.notCalled(organizationController.archiveOrganization);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/organizations/{id}/target-profiles', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add target profile to organization if admin member has allowed role', async function () {
      // given
      sinon.stub(organizationController, 'attachTargetProfiles').returns('ok');
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            'target-profiles-to-attach': ['7'],
          },
          type: 'organizations',
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/admin/organizations/1/target-profiles', payload);

      // then
      expect(response.statusCode).to.equal(200);
      sinon.assert.calledOnce(organizationController.attachTargetProfiles);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            'target-profiles-to-attach': ['7'],
          },
          type: 'organizations',
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/admin/organizations/1/target-profiles', payload);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/invitations', function () {
    const method = 'POST';
    const url = '/api/organizations/1/invitations';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return HTTP code 201', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').returns(true);
      sinon.stub(organizationController, 'sendInvitations').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'user1@organization.org',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should accept multiple emails', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').returns(true);
      sinon.stub(organizationController, 'sendInvitations').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'user1@organization.org, user2@organization.org',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject request with HTTP code 400, when email is empty', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: '',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject request with HTTP code 400, when input is not a email', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'azerty',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should check if user is admin in organization', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').resolves(false);
      sinon.stub(organizationController, 'sendInvitations').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'user1@organization.org',
          },
        },
      };

      // when
      await httpTestServer.request(method, url, payload);

      // then
      expect(securityPreHandlers.checkUserIsAdminInOrganization).to.have.be.called;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/organizations/{id}/invitations', function () {
    const method = 'POST';
    const url = '/api/admin/organizations/1/invitations';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return HTTP code 201', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon
        .stub(organizationController, 'sendInvitationByLangAndRole')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'user1@organization.org',
            lang: 'fr',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject request with HTTP code 400, when email is empty', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: '',
            lang: 'fr',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject request with HTTP code 400, when input is not a email', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'azerty',
            lang: 'fr',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject request with HTTP code 400, when lang is unknown', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'user1@organization.org',
            lang: 'pt',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF role', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          type: 'organization-invitations',
          attributes: {
            email: 'user1@organization.org',
            lang: 'fr',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/organizations/{id}/places', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return BadRequest (400) if id is not numeric', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const idNotNumeric = 'foo';
      const method = 'GET';
      const url = `/api/admin/organizations/${idNotNumeric}/places`;

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty list when no places is found', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(usecases, 'findOrganizationPlacesLot').returns([]);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'GET';
      const url = '/api/admin/organizations/1/places';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal([]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/organizations/{id}/places', function () {
    const method = 'POST';
    const url = '/api/admin/organizations/1/places';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return HTTP code 201', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

      sinon
        .stub(organizationController, 'createOrganizationPlacesLot')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            'organization-id': 2,
            count: 10,
            category: organizationPlacesCategories.FREE_RATE,
            'activation-date': '2022-01-02',
            'expiration-date': '2023-01-01',
            reference: 'ABC123',
            'created-by': 122,
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);
      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has a non super admin role', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            'organization-id': 2,
            count: 10,
            category: organizationPlacesCategories.FREE_RATE,
            'activation-date': '2022-01-02',
            'expiration-date': '2023-01-01',
            reference: 'ABC123',
            'created-by': 122,
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject request with HTTP code 403, when payload is incomplete', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            'organization-id': 2,
            count: 10,
            category: organizationPlacesCategories.FREE_RATE,
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organizations/{id}/invitations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty list when no organization is found', async function () {
      // given
      sinon.stub(usecases, 'findPendingOrganizationInvitations').resolves([]);
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').returns(true);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'GET';
      const url = '/api/organizations/1/invitations';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal([]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/schooling-registrations/import-csv', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the id not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('responds 400', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/qsdqsd/schooling-registrations/import-csv';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/sup-organization-learners/import-csv', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the id not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('responds 400', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/qsdqsd/sup-organization-learners/import-csv';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/schooling-registrations/replace-csv', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      sinon.restore();
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the user is an admin for the organization and the organization is SUP and manages student',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('responds 200', async function () {
          sinon.stub(organizationController, 'replaceSupOrganizationLearners');
          sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
          organizationController.replaceSupOrganizationLearners.resolves('ok');
          securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.resolves(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const method = 'POST';
          const url = '/api/organizations/1/schooling-registrations/replace-csv';

          const response = await httpTestServer.request(method, url);

          expect(response.statusCode).to.equal(200);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not admin for the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('responds 403', async function () {
        sinon.stub(organizationController, 'replaceSupOrganizationLearners');
        sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
        organizationController.replaceSupOrganizationLearners.resolves('ok');
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
          h.response().code(403).takeover()
        );
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/1/schooling-registrations/replace-csv';

        const response = await httpTestServer.request(method, url);

        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization id is not an id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('responds 400', async function () {
        sinon.stub(organizationController, 'replaceSupOrganizationLearners');
        sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
        organizationController.replaceSupOrganizationLearners.resolves('ok');
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.resolves(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/asgfs/schooling-registrations/replace-csv';

        const response = await httpTestServer.request(method, url);

        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/sup-organization-learners/replace-csv', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      sinon.restore();
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the user is an admin for the organization and the organization is SUP and manages student',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('responds 200', async function () {
          sinon.stub(organizationController, 'replaceSupOrganizationLearners');
          sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
          organizationController.replaceSupOrganizationLearners.resolves('ok');
          securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.resolves(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const method = 'POST';
          const url = '/api/organizations/1/sup-organization-learners/replace-csv';

          const response = await httpTestServer.request(method, url);

          expect(response.statusCode).to.equal(200);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not admin for the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('responds 403', async function () {
        sinon.stub(organizationController, 'replaceSupOrganizationLearners');
        sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
        organizationController.replaceSupOrganizationLearners.resolves('ok');
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
          h.response().code(403).takeover()
        );
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/1/sup-organization-learners/replace-csv';

        const response = await httpTestServer.request(method, url);

        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization id is not an id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('responds 400', async function () {
        sinon.stub(organizationController, 'replaceSupOrganizationLearners');
        sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
        organizationController.replaceSupOrganizationLearners.resolves('ok');
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.resolves(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/asgfs/sup-organization-learners/replace-csv';

        const response = await httpTestServer.request(method, url);

        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organizations/{id}/schooling-registrations/csv-template', function () {
    let httpTestServer: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      sinon
        .stub(organizationController, 'getOrganizationLearnersCsvTemplate')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));

      httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the organization controller to csv template', async function () {
      // given
      const method = 'GET';
      const url = '/api/organizations/1/schooling-registrations/csv-template?accessToken=token';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(organizationController.getOrganizationLearnersCsvTemplate).to.have.been.calledOnce;
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When parameters are not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when id is not a number', async function () {
        // given
        const method = 'GET';
        const url = '/api/organizations/ABC/schooling-registrations/csv-template?accessToken=token';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when id is null', async function () {
        // given
        const method = 'GET';
        const url = '/api/organizations/null/schooling-registrations/csv-template?accessToken=token';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when access token is not specified', async function () {
        // given
        const method = 'GET';
        const url = '/api/organizations/1/schooling-registrations/csv-template';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organizations/{id}/sup-organization-learners/csv-template', function () {
    let httpTestServer: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      sinon
        .stub(organizationController, 'getOrganizationLearnersCsvTemplate')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));

      httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the organization controller to csv template', async function () {
      // given
      const method = 'GET';
      const url = '/api/organizations/1/sup-organization-learners/csv-template?accessToken=token';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
      expect(organizationController.getOrganizationLearnersCsvTemplate).to.have.been.calledOnce;
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When parameters are not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when id is not a number', async function () {
        // given
        const method = 'GET';
        const url = '/api/organizations/ABC/sup-organization-learners/csv-template?accessToken=token';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when id is null', async function () {
        // given
        const method = 'GET';
        const url = '/api/organizations/null/sup-organization-learners/csv-template?accessToken=token';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error when access token is not specified', async function () {
        // given
        const method = 'GET';
        const url = '/api/organizations/1/sup-organization-learners/csv-template';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/schooling-registrations/import-siecle', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the organization controller to import organizationLearners', async function () {
      // given
      const method = 'POST';
      const url = '/api/organizations/1/schooling-registrations/import-siecle';
      const payload = {};

      sinon
        .stub(securityPreHandlers, 'checkUserIsAdminInSCOOrganizationManagingStudents')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(organizationController, 'importOrganizationLearnersFromSIECLE')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
      expect(organizationController.importOrganizationLearnersFromSIECLE).to.have.been.calledOnce;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when id is invalid', async function () {
      // given
      const method = 'POST';
      const url = '/api/organizations/wrongId/schooling-registrations/import-siecle';
      const payload = {};

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/sco-organization-learners/import-siecle', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the organization controller to import organizationLearners', async function () {
      // given
      const method = 'POST';
      const url = '/api/organizations/1/sco-organization-learners/import-siecle';
      const payload = {};

      sinon
        .stub(securityPreHandlers, 'checkUserIsAdminInSCOOrganizationManagingStudents')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(organizationController, 'importOrganizationLearnersFromSIECLE')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
      expect(organizationController.importOrganizationLearnersFromSIECLE).to.have.been.calledOnce;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when id is invalid', async function () {
      // given
      const method = 'POST';
      const url = '/api/organizations/wrongId/sco-organization-learners/import-siecle';
      const payload = {};

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/organizations/{id}/invitations/{invitationId}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the cancel organization invitation controller', async function () {
      // given
      sinon
        .stub(organizationController, 'cancelOrganizationInvitation')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').returns(true);

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'DELETE';
      const url = '/api/organizations/1/invitations/1';

      // when
      await httpTestServer.request(method, url);

      // then
      expect(securityPreHandlers.checkUserIsAdminInOrganization).to.have.be.called;
      expect(organizationController.cancelOrganizationInvitation).to.have.been.calledOnce;
    });
  });
});
