// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | oidc authentication url', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/oidc/authentication-url', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the request returns 200', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the authentication url for cnav', async function () {
        // given & when
        const response = await server.inject({
          method: 'GET',
          url: `/api/oidc/authentication-url?identity_provider=CNAV&redirect_uri=${encodeURIComponent(
            'http://app.pix.fr/connexion/cnav'
          )}`,
        });

        // then
        function _checkIfValidUUID(str: $TSFixMe) {
          const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
          return regexExp.test(str);
        }

        expect(response.statusCode).to.equal(200);
        expect(_checkIfValidUUID(response.result.state)).to.be.true;
        expect(_checkIfValidUUID(response.result.nonce)).to.be.true;

        // @ts-expect-error TS(2351): This expression is not constructable.
        const redirectTargetUrl = new URL(response.result.redirectTarget);

        expect(redirectTargetUrl.origin).to.equal('http://idp.cnav');
        expect(redirectTargetUrl.pathname).to.equal('/auth');
        expect(redirectTargetUrl.searchParams.get('redirect_uri')).to.equal('http://app.pix.fr/connexion/cnav');
        expect(redirectTargetUrl.searchParams.get('client_id')).to.equal('PIX_CNAV_CLIENT_ID');
        expect(redirectTargetUrl.searchParams.get('response_type')).to.equal('code');
        expect(redirectTargetUrl.searchParams.get('scope')).to.equal('openid profile');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the authentication url for pole emploi', async function () {
        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/oidc/authentication-url?identity_provider=POLE_EMPLOI&redirect_uri=${encodeURIComponent(
            'http://app.pix.fr/connexion/pole-emploi'
          )}`,
        });

        // then
        function _checkIfValidUUID(str: $TSFixMe) {
          const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
          return regexExp.test(str);
        }

        expect(response.statusCode).to.equal(200);
        expect(_checkIfValidUUID(response.result.state)).to.be.true;
        expect(_checkIfValidUUID(response.result.nonce)).to.be.true;

        // @ts-expect-error TS(2351): This expression is not constructable.
        const redirectTargetUrl = new URL(response.result.redirectTarget);

        expect(redirectTargetUrl.origin).to.equal('http://authurl.fr');
        expect(redirectTargetUrl.searchParams.get('redirect_uri')).to.equal('http://app.pix.fr/connexion/pole-emploi');
        expect(redirectTargetUrl.searchParams.get('client_id')).to.equal('PIX_POLE_EMPLOI_CLIENT_ID');
        expect(redirectTargetUrl.searchParams.get('response_type')).to.equal('code');
        expect(redirectTargetUrl.searchParams.get('realm')).to.equal('/individu');
        expect(redirectTargetUrl.searchParams.get('scope')).to.equal(
          'application_PIX_POLE_EMPLOI_CLIENT_ID api_peconnect-individuv1 openid profile'
        );
      });
    });
  });
});
