import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service session;

  get isLogged() {
    return this.session.isAuthenticated;
  }

  @action
  deco() {
    this.session.invalidate();
  }

  @action
  globalDeco() {
    this.session.singleLogout();
  }
}
