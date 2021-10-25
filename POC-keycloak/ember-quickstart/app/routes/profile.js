import OIDCApplicationRouteMixin from 'ember-simple-auth-oidc/mixins/oidc-application-route-mixin';
import Route from '@ember/routing/route';

export default class ProfileRoute extends Route.extend(
  OIDCApplicationRouteMixin
) {}
