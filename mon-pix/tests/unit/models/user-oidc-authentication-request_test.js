import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { expect } from 'chai';
import sinon from 'sinon/pkg/sinon-esm';
import ENV from '../../../config/environment';

describe('Unit | Model | user-oidc-authentication-request', function () {
  setupTest();

  describe('#login', function () {
    it('should login and return attributes', async function () {
      // given
      const store = this.owner.lookup('service:store');
      const adapter = store.adapterFor('user-oidc-authentication-request');
      sinon.stub(adapter, 'ajax');
      adapter.ajax.resolves({
        data: {
          attributes: {
            'full-name-from-pix': 'Loyd Pix',
            'full-name-from-external-identity-provider': 'Loyd Cé',
            username: 'loyd.ce123',
            email: 'loyd.ce@example.net',
            'authentication-methods': [{ identityProvider: 'oidc' }],
          },
        },
      });

      const userOidcAuthenticationRequest = store.createRecord('user-oidc-authentication-request', {
        password: 'pix123',
        email: 'glace.alo@example.net',
        authenticationKey: '123456azerty',
        identityProvider: 'oidc-partner',
      });

      // when
      const result = await userOidcAuthenticationRequest.login();

      // then
      const url = `${ENV.APP.API_HOST}/api/oidc/user/check-reconciliation`;
      const payload = {
        data: {
          data: {
            attributes: {
              password: 'pix123',
              email: 'glace.alo@example.net',
              'authentication-key': '123456azerty',
              'identity-provider': 'oidc-partner',
            },
            type: 'user-oidc-authentication-requests',
          },
        },
      };
      sinon.assert.calledWith(adapter.ajax, url, 'POST', payload);
      expect(result.email).to.deep.equal('loyd.ce@example.net');
      expect(result.fullNameFromPix).to.deep.equal('Loyd Pix');
      expect(result.fullNameFromExternalIdentityProvider).to.deep.equal('Loyd Cé');
      expect(result.username).to.deep.equal('loyd.ce123');
      expect(result.authenticationMethods).to.deep.equal([{ identityProvider: 'oidc' }]);
    });
  });
});
