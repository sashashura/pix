import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AuthenticatedRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  @action
  error(error) {
    if (error.errors[0].code === 403 && error.errors[0].meta === 'SECURITY_PREHANDLER_NOT_ALLOWED') {
      this.session.invalidate();
    } else {
      return true;
    }
  }
}
