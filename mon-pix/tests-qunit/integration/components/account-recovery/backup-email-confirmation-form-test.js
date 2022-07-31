import { module, test } from 'qunit';
import Service from '@ember/service';
import { triggerEvent } from '@ember/test-helpers';
import { render } from '@1024pix/ember-testing-library';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { contains } from '../../../helpers/contains';
import { fillInByLabel } from '../../../helpers/fill-in-by-label';
import { clickByLabel } from '../../../helpers/click-by-label';
import findByLabel from '../../../helpers/find-by-label';

module('Integration | Component | account-recovery::backup-email-confirmation-form', function (hooks) {
  setupIntlRenderingTest(hooks);

  const firstName = 'Philippe';
  const existingEmail = 'philippe@example.net';

  module('when the user already has an email associated with his account', function () {
    test('should render recover account backup email confirmation form with the existing email', async function (assert) {
      // given
      const resetErrors = sinon.stub();
      this.set('resetErrors', resetErrors);
      this.set('firstName', firstName);
      this.set('existingEmail', existingEmail);

      // when
      const screen = await render(
        hbs`<AccountRecovery::BackupEmailConfirmationForm @firstName={{this.firstName}} @existingEmail={{this.existingEmail}} @resetErrors={{this.resetErrors}}/>`
      );

      // then
      assert
        .dom(
          screen.getByText(
            this.intl.t(
              'pages.account-recovery.find-sco-record.backup-email-confirmation.email-already-exist-for-account-message'
            )
          )
        )
        .exists();
      assert
        .dom(
          screen.getByText(
            this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.email-is-valid-message'),
            { exact: false }
          )
        )
        .exists();
      assert
        .dom(
          screen.getByText(
            this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.ask-for-new-email-message'),
            { exact: false }
          )
        )
        .exists();
      assert
        .dom(
          screen.getByRole('link', {
            name: this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.email-reset-message'),
          })
        )
        .exists();
      assert
        .dom(
          screen.getByRole('textbox', {
            name: this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.email'),
          })
        )
        .exists();

      const submitButton = screen.getByRole('button', {
        name: this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.actions.submit'),
      });

      assert.dom(submitButton).exists();
      assert.true(submitButton.disabled);
    });
  });

  module('when the user does not have an email associated with his account', async function () {
    test('should render recover account backup email confirmation form', async function (assert) {
      // given
      const resetErrors = sinon.stub();
      this.set('resetErrors', resetErrors);
      this.set('firstName', firstName);

      // when
      await render(
        hbs`<AccountRecovery::BackupEmailConfirmationForm @firstName={{this.firstName}} @resetErrors={{this.resetErrors}}/>`
      );

      // then
      assert
        .dom(
          contains(
            this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.email-is-needed-message', {
              firstName,
            })
          )
        )
        .exists();
      assert
        .dom(
          contains(
            this.intl.t(
              'pages.account-recovery.find-sco-record.backup-email-confirmation.email-sent-to-choose-password-message'
            )
          )
        )
        .exists();
      assert
        .dom(contains(this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.email')))
        .exists();
      assert
        .dom(
          contains(
            this.intl.t(
              'pages.account-recovery.find-sco-record.backup-email-confirmation.email-already-exist-for-account-message'
            )
          )
        )
        .doesNotExist();
    });

    test('should enable submission on backup email confirmation form', async function (assert) {
      // given
      const email = 'Philipe@example.net';
      const resetErrors = sinon.stub();
      this.set('resetErrors', resetErrors);

      const createRecordStub = sinon.stub();

      class StoreStubService extends Service {
        createRecord = createRecordStub;
      }

      this.owner.register('service:store', StoreStubService);
      const sendEmail = sinon.stub();
      sendEmail.resolves();
      this.set('sendEmail', sendEmail);

      await render(
        hbs`<AccountRecovery::BackupEmailConfirmationForm @sendEmail={{this.sendEmail}} @resetErrors={{this.resetErrors}} />`
      );

      // when
      await fillInByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.email'),
        email
      );
      await clickByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.actions.submit')
      );

      // then
      assert.expect(0);
      sinon.assert.calledWithExactly(sendEmail, email);
    });

    test('should disable submission on backup email confirmation form when is loading', async function (assert) {
      // given
      const email = 'Philipe@example.net';

      await render(hbs`<AccountRecovery::BackupEmailConfirmationForm @isLoading={{true}} />`);

      // when
      await fillInByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.email'),
        email
      );

      // then
      const submitButton = findByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.actions.submit')
      );
      assert.true(submitButton.disabled);
    });
  });

  module('form validation', function () {
    test('should show an error when email is empty', async function (assert) {
      // given
      const resetErrors = sinon.stub();
      this.set('resetErrors', resetErrors);
      const email = '';

      await render(
        hbs`<AccountRecovery::BackupEmailConfirmationForm @firstName={{this.firstName}} @resetErrors={{this.resetErrors}}/>`
      );

      // when
      await fillInByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.email'),
        email
      );
      await triggerEvent('#email', 'focusout');

      // then
      assert
        .dom(
          contains(
            this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.error.empty-email')
          )
        )
        .exists();
    });

    test('should show an error when email is not valid', async function (assert) {
      // given
      const resetErrors = sinon.stub();
      this.set('resetErrors', resetErrors);
      const email = 'Philipe@';

      await render(
        hbs`<AccountRecovery::BackupEmailConfirmationForm @firstName={{this.firstName}} @resetErrors={{this.resetErrors}}/>`
      );

      // when
      await fillInByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.email'),
        email
      );
      await triggerEvent('#email', 'focusout');

      // then
      assert
        .dom(
          contains(
            this.intl.t(
              'pages.account-recovery.find-sco-record.backup-email-confirmation.form.error.wrong-email-format'
            )
          )
        )
        .exists();
    });

    test('should valid form when email is valid', async function (assert) {
      // given
      const resetErrors = sinon.stub();
      this.set('resetErrors', resetErrors);
      const sendEmail = sinon.stub();
      sendEmail.resolves();
      this.set('sendEmail', sendEmail);
      const email = 'Philipe@example.net';
      await render(
        hbs`<AccountRecovery::BackupEmailConfirmationForm @sendEmail={{this.sendEmail}} @firstName={{this.firstName}} @resetErrors={{this.resetErrors}}/>`
      );

      // when
      await fillInByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.email'),
        email
      );
      await clickByLabel(
        this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.actions.submit')
      );

      // then
      assert
        .dom(
          contains(
            this.intl.t(
              'pages.account-recovery.find-sco-record.backup-email-confirmation.form.error.wrong-email-format'
            )
          )
        )
        .doesNotExist();
      assert
        .dom(
          contains(
            this.intl.t('pages.account-recovery.find-sco-record.backup-email-confirmation.form.error.empty-email')
          )
        )
        .doesNotExist();
    });
  });
});
