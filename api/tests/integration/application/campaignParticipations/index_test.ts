// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/campaign-participations');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationController = require('../../../../lib/application/campaign-participations/campaign-participation-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Route | campaignParticipationRouter', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon
      .stub(campaignParticipationController, 'shareCampaignResult')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(201));
    sinon.stub(campaignParticipationController, 'getAnalysis').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
    sinon
      .stub(campaignParticipationController, 'getCampaignAssessmentParticipation')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
    sinon
      .stub(campaignParticipationController, 'getCampaignAssessmentParticipationResult')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/campaign-participations/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      const payload = {
        data: {
          type: 'campaign-participation',
          attributes: {
            isShared: true,
          },
        },
      };

      // when
      const response = await httpTestServer.request('PATCH', '/api/campaign-participations/1', payload);

      // then
      expect(response.statusCode).to.equal(201);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaign-participations/{id}/analyses', function () {
    const method = 'GET';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 - Bad request', async function () {
        // when
        const response = await httpTestServer.request(method, '/api/campaign-participations/FAKE_ID/analyses');

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id is an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200', async function () {
        // when
        const response = await httpTestServer.request(method, '/api/campaign-participations/12/analyses');

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{campaignId}/assessment-participations/{campaignParticipationId}', function () {
    const method = 'GET';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaignId is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 - Bad request', async function () {
        // when
        const response = await httpTestServer.request(method, '/api/campaigns/FAKE_ID/assessment-participations/1');

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaignParticipationId is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 - Bad request', async function () {
        // when
        const response = await httpTestServer.request(method, '/api/campaigns/1/assessment-participations/FAKE_ID');

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaignId and campaignParticipationId are integers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200', async function () {
        // when
        const response = await httpTestServer.request(method, '/api/campaigns/1/assessment-participations/1');

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{campaignId}/assessment-participations/{campaignParticipationId}/results', function () {
    const method = 'GET';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaignId is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 - Bad request', async function () {
        // when
        const response = await httpTestServer.request(
          method,
          '/api/campaigns/FAKE_ID/assessment-participations/1/results'
        );

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaignParticipationId is not an integer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 - Bad request', async function () {
        // when
        const response = await httpTestServer.request(
          method,
          '/api/campaigns/1/assessment-participations/FAKE_ID/results'
        );

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaignId and campaignParticipationId are integers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200', async function () {
        // when
        const response = await httpTestServer.request(method, '/api/campaigns/1/assessment-participations/1/results');

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
