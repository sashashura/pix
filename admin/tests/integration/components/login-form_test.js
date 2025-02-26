import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillByLabel, clickByName } from '@1024pix/ember-testing-library';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import { reject } from 'rsvp';
import ENV from 'pix-admin/config/environment';
import sinon from 'sinon';

const NOT_SUPER_ADMIN_MSG = "Vous n'avez pas les droits pour vous connecter.";

module('Integration | Component | login-form', function (hooks) {
  setupRenderingTest(hooks);

  test('it displays a entry form', async function (assert) {
    // when
    const screen = await render(hbs`<LoginForm />`);

    // then
    assert.dom(screen.getByRole('textbox', { name: 'Adresse e-mail' })).exists();
    assert.dom(screen.getByLabelText('Mot de passe')).exists();
    assert.dom(screen.getByRole('button', { name: 'Je me connecte' })).exists();
  });

  test('should hide error message by default', async function (assert) {
    // when
    await render(hbs`<LoginForm />`);

    // then
    assert.dom('p.login-form__error').doesNotExist();
  });

  module('Error management', function (hooks) {
    class SessionStub extends Service {
      authenticate = sinon.stub();
    }

    let sessionStub;

    hooks.beforeEach(function () {
      this.owner.register('service:session', SessionStub);
      sessionStub = this.owner.lookup('service:session');
    });

    test('should display good error message when an error 401 occurred', async function (assert) {
      // given
      const errorResponse = {
        responseJSON: {
          errors: [
            {
              status: ENV.APP.API_ERROR_MESSAGES.UNAUTHORIZED.CODE,
              detail: ENV.APP.API_ERROR_MESSAGES.UNAUTHORIZED.MESSAGE,
            },
          ],
        },
      };
      sessionStub.authenticate = () => reject(errorResponse);

      await render(hbs`<LoginForm />`);

      // when
      await fillByLabel('Adresse e-mail', 'pix@example.net');
      await fillByLabel('Mot de passe', 'JeMeLoggue1024');
      await clickByName('Je me connecte');

      // then
      assert.dom('p.login-form__error').exists();
      assert.dom('p.login-form__error').hasText(ENV.APP.API_ERROR_MESSAGES.UNAUTHORIZED.MESSAGE);
    });

    test('should display good error message when an error 400 occurred', async function (assert) {
      // given
      const errorResponse = {
        responseJSON: {
          errors: [
            {
              status: ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.CODE,
              detail: ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.MESSAGE,
            },
          ],
        },
      };
      sessionStub.authenticate = () => reject(errorResponse);

      await render(hbs`<LoginForm />`);

      // when
      await fillByLabel('Adresse e-mail', 'pix@');
      await fillByLabel('Mot de passe', 'JeMeLoggue1024');
      await clickByName('Je me connecte');

      // then
      assert.dom('p.login-form__error').exists();
      assert.dom('p.login-form__error').hasText(ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.MESSAGE);
    });

    test('should display good error message when an error 403 occurred', async function (assert) {
      // given
      const errorResponse = {
        responseJSON: { errors: [{ status: ENV.APP.API_ERROR_MESSAGES.FORBIDDEN, detail: NOT_SUPER_ADMIN_MSG }] },
      };
      sessionStub.authenticate = () => reject(errorResponse);

      await render(hbs`<LoginForm />`);

      // when
      await fillByLabel('Adresse e-mail', 'pix@example.net');
      await fillByLabel('Mot de passe', 'JeMeLoggue1024');
      await clickByName('Je me connecte');

      // then
      assert.dom('p.login-form__error').exists();
      assert.dom('p.login-form__error').hasText(NOT_SUPER_ADMIN_MSG);
    });

    test('should display good error message when an 500 error occurred', async function (assert) {
      // given
      const errorResponse = {
        responseJSON: {
          errors: [
            {
              status: ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.CODE,
              detail: ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.MESSAGE,
            },
          ],
        },
      };
      sessionStub.authenticate = () => reject(errorResponse);

      await render(hbs`<LoginForm />`);

      // when
      await fillByLabel('Adresse e-mail', 'pix@example.net');
      await fillByLabel('Mot de passe', 'JeMeLoggue1024');
      await clickByName('Je me connecte');

      // then
      assert.dom('p.login-form__error').exists();
      assert.dom('p.login-form__error').hasText(ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.MESSAGE);
    });

    test('should display good error message when an non handled status code', async function (assert) {
      // given
      const errorResponse = {
        responseJSON: { errors: [{ status: 502, detail: ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.MESSAGE }] },
      };
      sessionStub.authenticate = () => reject(errorResponse);

      await render(hbs`<LoginForm />`);

      // when
      await fillByLabel('Adresse e-mail', 'pix@example.net');
      await fillByLabel('Mot de passe', 'JeMeLoggue1024');
      await clickByName('Je me connecte');

      // then
      assert.dom('p.login-form__error').exists();
      assert.dom('p.login-form__error').hasText(ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.MESSAGE);
    });
  });
});
