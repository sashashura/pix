import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { fillIn, find, render, triggerEvent } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import hbs from 'htmlbars-inline-precompile';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { contains } from '../../helpers/contains';
import { clickByLabel } from '../../helpers/click-by-label';

const PASSWORD_INPUT_CLASS = '.form-textfield__input';

describe('Integration | Component | update-expired-password-form', function () {
  setupIntlRenderingTest();

  it('renders', async function () {
    // when
    await render(hbs`{{update-expired-password-form}}`);

    //then
    expect(find('.update-expired-password-form__container')).to.exist;
  });

  context('successful cases', function () {
    it('should save the new password, when button is clicked', async function () {
      // given
      const resetExpiredPasswordDemand = EmberObject.create({
        login: 'toto',
        password: 'Password123',
        updateExpiredPassword: sinon.stub(),
        unloadRecord: sinon.stub(),
      });
      this.set('resetExpiredPasswordDemand', resetExpiredPasswordDemand);
      const newPassword = 'Pix12345!';

      await render(hbs`<UpdateExpiredPasswordForm @resetExpiredPasswordDemand={{this.resetExpiredPasswordDemand}} />`);

      // when
      await fillIn(PASSWORD_INPUT_CLASS, newPassword);
      await triggerEvent(PASSWORD_INPUT_CLASS, 'change');

      await clickByLabel(this.intl.t('pages.update-expired-password.button'));

      // then
      expect(find(PASSWORD_INPUT_CLASS)).to.not.exist;
      expect(find('.password-reset-demand-form__body')).to.exist;
    });
  });

  context('errors cases', function () {
    it('should display an error, when saving fails', async function () {
      // given
      const expectedErrorMessage = this.intl.t('api-error-messages.internal-server-error');

      const resetExpiredPasswordDemand = EmberObject.create({
        login: 'toto',
        password: 'Password123',
        updateExpiredPassword: sinon.stub().rejects(),
        unloadRecord: sinon.stub(),
      });
      this.set('resetExpiredPasswordDemand', resetExpiredPasswordDemand);
      const newPassword = 'Pix12345!';

      await render(hbs`<UpdateExpiredPasswordForm @resetExpiredPasswordDemand={{this.resetExpiredPasswordDemand}} />`);

      // when
      await fillIn(PASSWORD_INPUT_CLASS, newPassword);
      await triggerEvent(PASSWORD_INPUT_CLASS, 'change');

      await clickByLabel(this.intl.t('pages.update-expired-password.button'));

      // then
      expect(contains(expectedErrorMessage)).to.exist;
    });
  });
});
