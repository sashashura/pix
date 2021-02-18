/* eslint ember/no-classic-classes: 0 */

import EmberObject from '@ember/object';
import Service from '@ember/service';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

const SplashServiceStub = EmberObject.extend({
  hideCount: 0,
  hide() {
    this.hideCount++;
  },
});

describe('Unit | Route | application', function() {

  setupTest();

  it('hides the splash when the route is activated', function() {
    // Given
    const splashStub = SplashServiceStub.create();
    const route = this.owner.lookup('route:application');
    route.set('splash', splashStub);

    // When
    route.activate();

    // Then
    expect(splashStub.hideCount).to.equal(1);
  });

  it('should load the current user', function() {
    // given
    const currentUserStub = {
      called: false,
      load() {
        this.called = true;
      },
    };
    const route = this.owner.lookup('route:application');
    route.set('currentUser', currentUserStub);

    // when
    route.sessionAuthenticated();

    // then
    expect(currentUserStub.called).to.be.true;
  });

  describe('#_getUserAndLocal', function() {

    describe('when user is connected', function() {

      it('should set locales from users', async function() {
        // given
        const user = {
          lang: 'en',
        };
        const load = sinon.stub().resolves(user);
        const currentUserStub = Service.create({ load, user });
        const setLocaleStub = sinon.stub();
        const intlStub = Service.create({
          setLocale: setLocaleStub,
        });
        const route = this.owner.lookup('route:application');
        route.set('currentUser', currentUserStub);
        route.set('intl', intlStub);

        // when
        await route._getUserAndLocal();

        // then
        sinon.assert.called(setLocaleStub);
        sinon.assert.calledWith(setLocaleStub, ['en', 'fr']);
      });

      //à mettre dans un context
      it('should update user language when domain is pix.org', async function() {
        // given
        const saveStub = sinon.stub().resolves();

        const user = {
          lang: 'fr',
          save: saveStub,
        };
        const loadStub = sinon.stub().resolves(user);
        const currentUserStub = Service.create({ load: loadStub, user });
        const setLocaleStub = sinon.stub();
        const intlStub = Service.create({
          setLocale: setLocaleStub,
        });
        const route = this.owner.lookup('route:application');
        route.set('currentUser', currentUserStub);
        route.set('intl', intlStub);
        route.set('currentDomain', { getExtension() { return 'org'; } });

        // when
        await route._getUserAndLocal('en');

        // then
        sinon.assert.called(saveStub);
        sinon.assert.calledWith(saveStub, { adapterOptions: { lang: 'en' } });
      });

      //à mettre dans un context
      it('should not update user language when domain is pix.fr', async function() {
        // given
        const saveStub = sinon.stub().resolves();

        const user = {
          lang: 'fr',
          save: saveStub,
        };
        const loadStub = sinon.stub().resolves(user);
        const currentUserStub = Service.create({ load: loadStub, user });
        const setLocaleStub = sinon.stub();
        const intlStub = Service.create({
          setLocale: setLocaleStub,
        });
        const route = this.owner.lookup('route:application');
        route.set('currentUser', currentUserStub);
        route.set('intl', intlStub);
        route.set('currentDomain', { getExtension() { return 'fr'; } });

        // when
        await route._getUserAndLocal('en');

        // then
        sinon.assert.notCalled(saveStub);
      });

      it('should ignore language switch when is neither "fr" nor "en"', async function() {
        // given
        const saveStub = sinon.stub().rejects({ errors: [{ status: '400' }] });
        const rollbackAttributesStub = sinon.stub().resolves();

        const user = {
          lang: 'fr',
          save: saveStub,
          rollbackAttributes: rollbackAttributesStub,
        };
        const loadStub = sinon.stub().resolves(user);
        const currentUserStub = Service.create({ load: loadStub, user });
        const setLocaleStub = sinon.stub();
        const intlStub = Service.create({
          setLocale: setLocaleStub,
        });
        const route = this.owner.lookup('route:application');
        route.set('currentUser', currentUserStub);
        route.set('intl', intlStub);

        // when
        await route._getUserAndLocal('bouh');

        // then
        sinon.assert.called(rollbackAttributesStub);
      });
    });

    it('should not update locale when domain is pix.fr', async function() {
      // given
      const setLocaleStub = sinon.stub();
      const intlStub = Service.create({
        setLocale: setLocaleStub,
      });
      const route = this.owner.lookup('route:application');
      route.set('intl', intlStub);
      route.set('currentDomain', { getExtension() { return 'fr'; } });

      // when
      await route._getUserAndLocal('en');

      // then
      sinon.assert.called(setLocaleStub);
      sinon.assert.calledWith(setLocaleStub, ['fr', 'fr']);
    });

    it('should update locale when domain is pix.org', async function() {
      // given
      const setLocaleStub = sinon.stub();
      const intlStub = Service.create({
        setLocale: setLocaleStub,
      });
      const route = this.owner.lookup('route:application');
      route.set('intl', intlStub);
      route.set('currentDomain', { getExtension() { return 'org'; } });

      // when
      await route._getUserAndLocal('en');

      // then
      sinon.assert.called(setLocaleStub);
      sinon.assert.calledWith(setLocaleStub, ['en', 'fr']);
    });

  });

});
