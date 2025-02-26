import { expect } from 'chai';
import { describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | challenge actions', function () {
  setupIntlRenderingTest();

  it('renders', async function () {
    await render(hbs`<ChallengeActions/>`);
    expect(find('.challenge-actions__group')).to.exist;
  });

  describe('Challenge has timed out', function () {
    it('should only display "continue" button', async function () {
      // given
      this.set('isValidateButtonEnabled', true);
      this.set('hasChallengeTimedOut', true);
      this.set('isSkipButtonEnabled', true);
      this.set('validateActionStub', () => {});

      // when
      await render(hbs`<ChallengeActions
                          @validateAnswer={{this.validateActionStub}}
                          @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
                          @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
                          @isSkipButtonEnabled={{this.isSkipButtonEnabled}}/>`);

      // then
      expect(find('.challenge-actions__action-validated')).to.not.exist;
      expect(find('.challenge-actions__action-skip')).to.not.exist;
      expect(find('.challenge-actions__action-continue')).to.exist;
    });
  });

  describe('when user has focused out', function () {
    context('when assessent is of type certification', function () {
      it("should show certification focus out's error message", async function () {
        // given
        this.set('isValidateButtonEnabled', true);
        this.set('isCertification', true);
        this.set('hasFocusedOutOfWindow', true);
        this.set('hasChallengeTimedOut', false);
        this.set('isSkipButtonEnabled', true);
        this.set('validateActionStub', () => {});

        // when
        await render(hbs`<ChallengeActions
                            @isCertification={{this.isCertification}}
                            @validateAnswer={{this.validateActionStub}}
                            @hasFocusedOutOfWindow={{this.hasFocusedOutOfWindow}}
                            @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
                            @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
                            @isSkipButtonEnabled={{this.isSkipButtonEnabled}}/>`);

        // then
        expect(find('[data-test="certification-focused-out-error-message"]')).to.exist;
        expect(find('[data-test="default-focused-out-error-message"]')).not.to.exist;
      });
    });

    context('when assessent is not of type certification', function () {
      it("should show default focus out's error message", async function () {
        // given
        this.set('isValidateButtonEnabled', true);
        this.set('isCertification', false);
        this.set('hasFocusedOutOfWindow', true);
        this.set('hasChallengeTimedOut', false);
        this.set('isSkipButtonEnabled', true);
        this.set('validateActionStub', () => {});

        // when
        await render(hbs`<ChallengeActions
                            @isCertification={{this.isCertification}}
                            @validateAnswer={{this.validateActionStub}}
                            @hasFocusedOutOfWindow={{this.hasFocusedOutOfWindow}}
                            @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
                            @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
                            @isSkipButtonEnabled={{this.isSkipButtonEnabled}}/>`);

        // then
        expect(find('[data-test="certification-focused-out-error-message"]')).not.to.exist;
        expect(find('[data-test="default-focused-out-error-message"]')).to.exist;
      });
    });
  });
});
