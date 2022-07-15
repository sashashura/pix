import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import get from 'lodash/get';
import ENV from 'mon-pix/config/environment';
import fetch from 'fetch';

export default class LoginOidcRoute extends Route {
  @service session;
  @service router;
  @service location;

  get redirectUri() {
    const { protocol, host } = location;
    const path = this.router.urlFor(this.routeName);
    return `${protocol}//${host}${path}`;
  }

  beforeModel(transition) {
    const queryParams = transition.to.queryParams;
    if (queryParams.error) {
      throw new Error(`${queryParams.error}: ${queryParams.error_description}`);
    }

    if (!queryParams.code) {
      return this._handleRedirectRequest();
    }
  }

  async model(params, transition) {
    const queryParams = transition.to.queryParams;
    this.idpName = params.idp_name;
    if (queryParams.code) {
      return this._handleCallbackRequest(queryParams.code, queryParams.state);
    }
  }

  afterModel({ shouldValidateCgu, authenticationKey } = {}) {
    if (shouldValidateCgu && authenticationKey) {
      // TODO
      return this.router.replaceWith('terms-of-service-oidc', {
        queryParams: { authenticationKey, idpName: this.idpName },
      });
    }
  }

  async _handleCallbackRequest(code, state) {
    try {
      // TODO
      await this.session.authenticate(`authenticator:${this.idpName}`, {
        code,
        redirectUri: this.redirectUri,
        state,
      });
    } catch (response) {
      const shouldValidateCgu = get(response, 'errors[0].code') === 'SHOULD_VALIDATE_CGU';
      const authenticationKey = get(response, 'errors[0].meta.authenticationKey');
      if (shouldValidateCgu && authenticationKey) {
        return { shouldValidateCgu, authenticationKey };
      }
      throw new Error(JSON.stringify(response.errors));
    } finally {
      this.session.set('data.state', undefined);
      this.session.set('data.nonce', undefined);
    }
  }

  async _handleRedirectRequest() {
    // TODO
    const response = await fetch(
      `${ENV.APP.API_HOST}/api/${this.idpName}/auth-url?redirect_uri=${encodeURIComponent(this.redirectUri)}`
    );
    const { redirectTarget, state, nonce } = await response.json();
    this.session.set('data.state', state);
    this.session.set('data.nonce', nonce);
    this.location.replace(redirectTarget);
  }
}
