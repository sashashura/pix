import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { clickByLabel } from '../../helpers/click-by-label';
import { render } from '@1024pix/ember-testing-library';

describe('Integration | Component | certification results template', function () {
  setupIntlRenderingTest();

  context('When component is rendered', function () {
    const certificationNumber = 'certification-number';

    beforeEach(function () {
      this.set('certificationNumber', certificationNumber);
    });

    it('should not be able to click on validation button when the verification is unchecked ', async function () {
      // when
      await render(hbs`{{certification-results-page certificationNumber=certificationNumber}}`);

      // then
      expect(find('.result-content__validation-button')).to.not.exist;
      expect(find('.result-content__button-blocked')).to.exist;
    });

    it('should be able to click on validation when we check to show the last message', async function () {
      // when
      const screen = await render(hbs`{{certification-results-page certificationNumber=certificationNumber}}`);
      await click(
        screen.getByRole('checkbox', { name: this.intl.t('pages.certification-results.not-finished.checkbox-label') })
      );
      await clickByLabel(this.intl.t('pages.certification-results.action.confirm'));

      // then
      expect(find('.result-content__panel-description').textContent).to.contains(
        'Vos résultats seront prochainement disponibles depuis votre compte.'
      );
    });

    it('should have a button to logout at the end of certification', async function () {
      // when
      const screen = await render(hbs`{{certification-results-page certificationNumber=certificationNumber}}`);
      await click(
        screen.getByRole('checkbox', { name: this.intl.t('pages.certification-results.not-finished.checkbox-label') })
      );
      await clickByLabel(this.intl.t('pages.certification-results.action.confirm'));

      // then
      expect(find('.result-content__logout-button')).to.exist;
      expect(find('.result-content__logout-button').textContent).to.equal('Se déconnecter');
    });
  });
});
