// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/campaigns');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignController = require('../../../../lib/application/campaigns/campaign-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Route | campaignRouter', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(campaignController, 'save').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
    sinon.stub(campaignController, 'getCsvAssessmentResults').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
    sinon
      .stub(campaignController, 'getCsvProfilesCollectionResults')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
    sinon.stub(campaignController, 'getById').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
    sinon.stub(campaignController, 'getAnalysis').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/campaigns', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // when
      const response = await httpTestServer.request('POST', '/api/campaigns');

      // then
      expect(response.statusCode).to.equal(201);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/csv-assessment-results', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-assessment-results');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/csv-profiles-collection-results', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-profiles-collection-results');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 200', async function () {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/analyses', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      const campaignId = 1;

      // when
      const response = await httpTestServer.request('GET', `/api/campaigns/${campaignId}/analyses`);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400', async function () {
      // given
      const campaignId = 'wrongId';

      // when
      const response = await httpTestServer.request('GET', `/api/campaigns/${campaignId}/analyses`);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });
});
