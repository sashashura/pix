// import OIDCApplicationRouteMixin from 'ember-simple-auth-oidc/mixins/oidc-application-route-mixin';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default class ProfileRoute extends Route.extend(
  AuthenticatedRouteMixin
) {
  @service ajax;
  @service session;

  async model() {
    console.log(this.session.data);
    try {
      const apiResponse = await this.ajax.request('/api/users/me', {
        headers: {
          authorization: `Bearer ${this.session.data.authenticated.access_token}`,
        },
      });
      return apiResponse;
    } catch (e) {
      console.error('request error', e);
      return 'oops';
    }
  }
}
