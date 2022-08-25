import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserTutorialsRoute extends Route {
  @service store;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthenticationAndApprovedTermsOfService(transition);
  }

  model() {
    return this.store.findAll('area');
  }
}
