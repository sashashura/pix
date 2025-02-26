import { describe, it } from 'mocha';
import { expect } from 'chai';
import { find, findAll, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

describe('Integration | Component | Tutorials | Cards', function () {
  setupIntlRenderingTest();

  it('renders no cards if there are no tutorials', async function () {
    // given
    const tutorials = [];
    this.set('tutorials', tutorials);

    // when
    await render(hbs`<Tutorials::Cards @tutorials={{this.tutorials}} />`);

    // then
    expect(find('.user-tutorials-content-v2__cards')).to.exist;
    expect(findAll('.tutorial-card-v2').length).to.equal(0);
  });

  it('renders a list of cards if there are tutorials', async function () {
    // given
    const tutorial1 = {
      title: 'Mon super tutoriel',
      link: 'https://exemple.net/',
      source: 'mon-tuto',
      format: 'vidéo',
      duration: '00:01:00',
      isEvaluated: true,
      isSaved: true,
    };

    const tutorial2 = {
      title: 'Mon deuxième super tutoriel',
      link: 'https://exemple2.net/',
      source: 'mon-tuto-2',
      format: 'vidéo',
      duration: '00:02:00',
      isEvaluated: true,
      isSaved: true,
    };
    const tutorials = [tutorial1, tutorial2];
    this.set('tutorials', tutorials);

    // when
    await render(hbs`<Tutorials::Cards @tutorials={{this.tutorials}} />`);

    // then
    expect(find('.user-tutorials-content-v2__cards')).to.exist;
    expect(findAll('.tutorial-card-v2').length).to.equal(2);
  });
});
