// import OIDCApplicationRouteMixin from 'ember-simple-auth-oidc/mixins/oidc-application-route-mixin';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ProfileRoute extends Route.extend(
  AuthenticatedRouteMixin
) {}
