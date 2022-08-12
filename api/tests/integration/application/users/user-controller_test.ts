// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToRemoveAuthenticationMethod } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/read-models/participant-results/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/users');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Users | user-controller', function () {
  let sandbox: $TSFixMe;
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(securityPreHandlers, 'checkRequestedUserIsAuthenticatedUser');
    sandbox.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf');

    sandbox.stub(usecases, 'getUserCampaignParticipationToCampaign');
    sandbox.stub(usecases, 'getUserProfileSharedForCampaign');
    sandbox.stub(usecases, 'getUserCampaignAssessmentResult');
    sandbox.stub(usecases, 'removeAuthenticationMethod');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sandbox.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserCampaignParticipationToCampaign', function () {
    const auth = { credentials: {}, strategy: {} };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line mocha/no-setup-in-describe
      const campaignParticipation = domainBuilder.buildCampaignParticipation();

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.returns(true);
        (auth.credentials as $TSFixMe).userId = '1234';
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.getUserCampaignParticipationToCampaign.resolves(campaignParticipation);

        // when
        const response = await httpTestServer.request(
          'GET',
          '/api/users/1234/campaigns/5678/campaign-participations',
          null,
          auth
        );

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(403).takeover());
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 403 HTTP response', async function () {
        // when
        const response = await httpTestServer.request('GET', '/api/users/1234/campaigns/5678/campaign-participations');

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserProfileSharedForCampaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 403 HTTP response', async function () {
        // given
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(403).takeover());
        });

        // when
        const response = await httpTestServer.request('GET', '/api/users/1234/campaigns/5678/profile');

        // then
        expect(response.statusCode).to.equal(403);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 401 HTTP response', async function () {
        // given
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(401).takeover());
        });

        // when
        const response = await httpTestServer.request('GET', '/api/users/1234/campaigns/5678/profile');

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserCampaignAssessmentResult', function () {
    const auth = { credentials: {}, strategy: {} };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      const campaignAssessmentResult = new AssessmentResult(
        { knowledgeElements: [] },
        { competences: [], badges: [], stages: [] },
        false
      );

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.returns(true);
        (auth.credentials as $TSFixMe).userId = '1234';
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.getUserCampaignAssessmentResult
          .withArgs({ userId: '1234', campaignId: 5678, locale: 'fr-fr' })
          .resolves(campaignAssessmentResult);

        // when
        const response = await httpTestServer.request(
          'GET',
          '/api/users/1234/campaigns/5678/assessment-result',
          null,
          auth
        );

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 403 HTTP response', async function () {
        // given
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(403).takeover());
        });

        // when
        const response = await httpTestServer.request('GET', '/api/users/1234/campaigns/5678/assessment-result');

        // then
        expect(response.statusCode).to.equal(403);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 401 HTTP response', async function () {
        // given
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(401).takeover());
        });

        // when
        const response = await httpTestServer.request('GET', '/api/users/1234/campaigns/5678/assessment-result');

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#removeAuthenticationMethod', function () {
    const method = 'POST';
    const url = '/api/admin/users/1/remove-authentication';
    const payload = {
      data: {
        attributes: {
          type: 'EMAIL',
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a HTTP response with status code 204', async function () {
        // given
        usecases.removeAuthenticationMethod.resolves();

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 403 HTTP response when when user is not allowed to access resource', async function () {
        // given
        securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(403);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 403 HTTP response when the usecase throw a UserNotAuthorizedToRemoveAuthenticationMethod', async function () {
        // given
        usecases.removeAuthenticationMethod.throws(new UserNotAuthorizedToRemoveAuthenticationMethod());
        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
