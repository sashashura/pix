import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';
import REST from '@ember-data/adapter/rest';
import sinon from 'sinon';

describe('Unit | Adapters | ApplicationAdapter', function () {
  setupTest();

  it('should specify /api as the root url', function () {
    // Given
    const applicationAdapter = this.owner.lookup('adapter:application');

    // Then
    expect(applicationAdapter.namespace).to.equal('api');
  });

  describe('get headers()', function () {
    it('should add header with authentication token when the session is authenticated', function () {
      // Given
      const access_token = '23456789';
      const applicationAdapter = this.owner.lookup('adapter:application');

      // When
      applicationAdapter.set('session', { isAuthenticated: true, data: { authenticated: { access_token } } });

      // Then
      expect(applicationAdapter.headers['Authorization']).to.equal(`Bearer ${access_token}`);
    });

    it('should not add header authentication token when the session is not authenticated', function () {
      // Given
      const applicationAdapter = this.owner.lookup('adapter:application');

      // When
      applicationAdapter.set('session', {});

      // Then
      expect(applicationAdapter.headers['Authorization']).to.be.undefined;
    });

    it('should add Accept-Language header set to fr-fr when the current domain contains pix.fr and locale is "fr"', function () {
      // Given
      const applicationAdapter = this.owner.lookup('adapter:application');
      applicationAdapter.intl = { get: () => ['fr'] };

      // When
      applicationAdapter.set('currentDomain', {
        getExtension() {
          return 'fr';
        },
      });

      // Then
      expect(applicationAdapter.headers['Accept-Language']).to.equal('fr-fr');
    });

    it('should add Accept-Language header set to fr when the current domain contains pix.digital and locale is "fr"', function () {
      // Given
      const applicationAdapter = this.owner.lookup('adapter:application');
      applicationAdapter.intl = { get: () => ['fr'] };

      // When
      applicationAdapter.set('currentDomain', {
        getExtension() {
          return 'digital';
        },
      });

      // Then
      expect(applicationAdapter.headers['Accept-Language']).to.equal('fr');
    });

    it('should add Accept-Language header set to en when locale is "en"', function () {
      // Given
      const applicationAdapter = this.owner.lookup('adapter:application');

      // When
      applicationAdapter.intl = { get: () => ['en'] };

      // Then
      expect(applicationAdapter.headers['Accept-Language']).to.equal('en');
    });
  });

  describe('ajax()', function () {
    it('should queue ajax calls', function () {
      // Given
      const applicationAdapter = this.owner.lookup('adapter:application');
      applicationAdapter.ajaxQueue = { add: sinon.stub().resolves() };

      // When
      applicationAdapter.findRecord(null, { modelName: 'user' }, 1);

      // Then
      sinon.assert.calledOnce(applicationAdapter.ajaxQueue.add);
    });
  });

  describe('handleResponse()', function () {
    context('when an HTTP status code 401 is received', function () {
      it('should invalidate the current session', function () {
        // given
        const applicationAdapter = this.owner.lookup('adapter:application');
        const session = this.owner.lookup('service:session');
        const status = 401;
        const headers = {};
        const payload = {};
        const requestData = {};

        sinon.stub(session, 'invalidate');
        session.isAuthenticated = true;

        // when
        applicationAdapter.handleResponse(status, headers, payload, requestData);

        // then
        sinon.assert.calledOnce(session.invalidate);
      });
    });

    context('when the HTTP status code received is different from 401', function () {
      it('should not invalidate the current session', function () {
        // given
        const applicationAdapter = this.owner.lookup('adapter:application');
        const session = this.owner.lookup('service:session');
        sinon.stub(REST.prototype, 'handleResponse');
        sinon.stub(session, 'invalidate');

        // when
        applicationAdapter.handleResponse(302);

        // then
        sinon.assert.notCalled(session.invalidate);
        sinon.assert.calledOnce(REST.prototype.handleResponse);
        sinon.restore();
      });
    });
  });
});
