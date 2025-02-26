import { expect } from 'chai';
import { describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | pix-choice-chip', function () {
  setupIntlRenderingTest();

  it('renders', async function () {
    //when
    await render(hbs`<ChoiceChip>Test</ChoiceChip>`);

    //then
    expect(find('.pix-choice-chip')).to.exist;
  });
});
