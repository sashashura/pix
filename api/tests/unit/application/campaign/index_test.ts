// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/campaigns');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignController = require('../../../../lib/application/campaigns/campaign-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignSt... Remove this comment to see the full error message
const campaignStatsController = require('../../../../lib/application/campaigns/campaign-stats-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignMa... Remove this comment to see the full error message
const campaignManagementController = require('../../../../lib/application/campaigns/campaign-management-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Router | campaign-router ', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/campaigns', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201', async function () {
      // given
      sinon.stub(campaignController, 'save').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/campaigns');

      // then
      expect(response.statusCode).to.equal(201);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns?filter[code=SOMECODE]', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(campaignController, 'getByCode').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // given
      campaignController.getByCode.returns('ok');

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns?filter[code=SOMECODE]');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 when controller throws a NotFound domain error', async function () {
      // given
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      sinon.stub(campaignController, 'getByCode').rejects(new NotFoundError());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns?filter[code=SOMECODE]');

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(campaignController, 'getById').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/csv-assessment-results', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(campaignController, 'getCsvAssessmentResults').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-assessment-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/csv-assessment-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/csv-profiles-collection-results', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon
        .stub(campaignController, 'getCsvProfilesCollectionResults')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-profiles-collection-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/csv-profiles-collection-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/campaigns/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/campaigns/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(campaignManagementController, 'updateCampaignDetailsManagement')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          type: 'campaigns',
          attributes: {
            name: 'name',
            title: 'title',
            'custom-landing-page-text': null,
            'custom-result-page-text': null,
            'custom-result-page-button-text': null,
            'custom-result-page-button-url': null,
            'multiple-sendings': false,
          },
        },
      };

      // when
      const response = await httpTestServer.request('PATCH', '/api/admin/campaigns/1', payload);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/admin/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 when name is null', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          type: 'campaigns',
          attributes: {
            name: null,
            title: null,
            'custom-result-page-text': null,
            'custom-result-page-button-text': null,
            'custom-result-page-button-url': null,
            'custom-landing-page-text': null,
            'multiple-sendings': false,
          },
        },
      };

      // when
      const response = await httpTestServer.request('PATCH', '/api/admin/campaigns/1', payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 when name is empty', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          type: 'campaigns',
          attributes: {
            name: '',
            title: null,
            'custom-result-page-text': null,
            'custom-result-page-button-text': null,
            'custom-result-page-button-url': null,
            'custom-landing-page-text': null,
            'multiple-sendings': false,
          },
        },
      };

      // when
      const response = await httpTestServer.request('PATCH', '/api/admin/campaigns/1', payload);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 when title is empty', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          type: 'campaigns',
          attributes: {
            name: 'name',
            title: '',
            'custom-result-page-text': null,
            'custom-result-page-button-text': null,
            'custom-result-page-button-url': null,
            'custom-landing-page-text': null,
            'multiple-sendings': false,
          },
        },
      };

      // when
      const response = await httpTestServer.request('PATCH', '/api/admin/campaigns/1', payload);

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
          type: 'campaigns',
          attributes: {
            name: 'name',
            title: 'title',
            'custom-landing-page-text': null,
            'custom-result-page-text': null,
            'custom-result-page-button-text': null,
            'custom-result-page-button-url': null,
            'multiple-sendings': false,
          },
        },
      };

      // when
      const response = await httpTestServer.request('PATCH', '/api/admin/campaigns/1', payload);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/campaigns/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon
        .stub(campaignManagementController, 'getCampaignDetails')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/campaigns/1');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 when unauthorized', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
        .returns((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/campaigns/1');

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/campaigns/{id}/participations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon
        .stub(campaignManagementController, 'findPaginatedParticipationsForCampaignManagement')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/campaigns/1/participations');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/campaigns/invalid/participations');

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 when unauthorized', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
        .returns((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/campaigns/1/participations');

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/collective-results', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(campaignController, 'getCollectiveResult').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/collective-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/collective-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/analyses', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(campaignController, 'getAnalysis').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/analyses');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/wrong_id/analyses');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/campaigns/{id}/archive', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PUT', '/api/campaigns/invalid/archive');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/campaigns/{id}/archive', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('DELETE', '/api/campaigns/invalid/archive');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/profiles-collection-participations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with empty query string', async function () {
      // given
      sinon
        .stub(campaignController, 'findProfilesCollectionParticipations')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations');

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with pagination', async function () {
      // given
      sinon.stub(campaignController, 'findProfilesCollectionParticipations').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?page[number]=1&page[size]=25'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with a string array of one element as division filter', async function () {
      // given
      sinon.stub(campaignController, 'findProfilesCollectionParticipations').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?filter[divisions][]="3EMEB"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with a string array of several elements as division filter', async function () {
      // given
      sinon.stub(campaignController, 'findProfilesCollectionParticipations').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with a string array of one element as group filter', async function () {
      // given
      sinon.stub(campaignController, 'findProfilesCollectionParticipations').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?filter[groups][]="AB1"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with a string array of several elements as group filter', async function () {
      // given
      sinon.stub(campaignController, 'findProfilesCollectionParticipations').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?filter[groups][]="AB1"&filter[groups][]="AB2"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with unexpected filters', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?filter[unexpected][]=5'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with a division filter which is not an array', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?filter[divisions]="3EMEA"'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with a group filter which is not an array', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?filter[groups]="AB3"'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with a page number which is not a number', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?page[number]=a'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with a page size which is not a number', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/profiles-collection-participations?page[size]=a'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/profiles-collection-participations');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/divisions', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(campaignController, 'division').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/divisions');

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/divisions');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/groups', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(campaignController, 'getGroups').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/groups');

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/groups');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/stats/participations-by-stage', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon
        .stub(campaignStatsController, 'getParticipationsByStage')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/stats/participations-by-stage');

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/stats/participations-by-stage');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/stats/participations-by-status', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      sinon
        .stub(campaignStatsController, 'getParticipationsByStatus')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));

      // when
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const result = await httpTestServer.request('GET', '/api/campaigns/1/stats/participations-by-status');

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // when
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/stats/participations-by-status');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/participants-activity', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      sinon.stub(campaignController, 'findParticipantsActivity').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));

      // when
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const result = await httpTestServer.request('GET', '/api/campaigns/1/participants-activity');

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with a string array of one element as division filter', async function () {
      // given
      sinon.stub(campaignController, 'findParticipantsActivity').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/participants-activity?filter[divisions][]="3EMEB"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 with a string array of several elements as division filter', async function () {
      // given
      sinon.stub(campaignController, 'findParticipantsActivity').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/participants-activity?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      // when
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/participants-activity');

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with unexpected filters', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/participants-activity?filter[unexpected][]=5'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with a division filter which is not an array', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/campaigns/1/participants-activity?filter[divisions]="3EMEA"'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/stats/participations-by-mastery-rate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon
        .stub(campaignStatsController, 'getParticipationsCountByMasteryRate')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
    });
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      sinon.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const result = await httpTestServer.request('GET', '/api/campaigns/1/stats/participations-by-mastery-rate');

      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 with an invalid campaign id', async function () {
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/stats/participations-by-mastery-rate');

      expect(result.statusCode).to.equal(400);
    });
  });
});
