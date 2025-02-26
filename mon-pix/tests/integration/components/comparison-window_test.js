import EmberObject from '@ember/object';
import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | comparison-window', function () {
  setupIntlRenderingTest();

  describe('rendering', function () {
    let answer;
    let challenge;
    let correction;

    beforeEach(function () {
      answer = EmberObject.create({
        value: '1,2',
        result: 'ko',
        isResultNotOk: true,
      });
      challenge = EmberObject.create({
        instruction: 'This is the instruction',
        proposals:
          '' + '- 1ere possibilite\n ' + '- 2eme possibilite\n ' + '- 3eme possibilite\n' + '- 4eme possibilite',
      });
      correction = EmberObject.create({ solution: '2,3', learningMoreTutorials: [], tutorials: [] });

      this.set('answer', answer);
      answer.set('challenge', challenge);
      answer.set('correction', correction);
      this.set('closeComparisonWindow', () => {});
    });

    it('renders', async function () {
      // when
      await render(
        hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
      );

      // then
      expect(find('.pix-modal-overlay')).to.exist;
    });

    it('should display challenge illustration and alt', async function () {
      // given
      challenge.set('illustrationUrl', '/images/pix-logo.svg');
      challenge.set('illustrationAlt', 'texte alternatif');

      // when
      await render(
        hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
      );

      // then
      expect(find('.challenge-illustration__loaded-image').src).to.contains(challenge.illustrationUrl);
      expect(find('.challenge-illustration__loaded-image').alt).to.equal(challenge.illustrationAlt);
    });

    it('should render challenge result in the header', async function () {
      // when
      await render(
        hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
      );

      // then
      expect(find('.comparison-window__header')).to.exist;
      expect(find('.comparison-window-header__result-item-icon')).to.exist;
    });

    it('should render challenge instruction', async function () {
      // when
      await render(
        hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
      );

      // then
      expect(find('.comparison-window-content-body__instruction')).to.exist;
    });

    it('should render a feedback panel already opened', async function () {
      //when
      await render(
        hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
      );

      //then
      expect(find('.comparison-window__feedback-panel')).to.exist;
      expect(find('.feedback-panel__form')).to.exist;
    });

    [
      { status: 'ok', color: 'green', icon: 'circle-check' },
      { status: 'ko', color: 'red', icon: 'circle-xmark' },
      { status: 'aband', color: 'grey', icon: 'circle-xmark' },
      { status: 'partially', color: 'orange', icon: 'circle-check' },
      { status: 'timedout', color: 'red', icon: 'circle-xmark' },
    ].forEach(function (data) {
      it(`should display the good icon in title when answer's result is "${data.status}"`, async function () {
        // given
        answer.setProperties({
          result: data.status,
          isResultNotOk: data.status !== 'ok',
        });

        // when
        await render(
          hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
        );

        // then
        expect(find(`.comparison-window-header__result-item-icon--${data.color}`)).to.exist;
        expect(find(`.comparison-window-header__result-item-icon svg.fa-${data.icon}`)).to.exist;
      });
    });

    it('should render a tutorial panel with a hint', async function () {
      // given
      answer.set('result', 'ko');
      correction.set('hint', 'Conseil : mangez des épinards.');

      // when
      await render(
        hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
      );

      // then
      expect(find('.tutorial-panel')).to.contain.text('Conseil : mangez des épinards.');
    });

    it('should render a learningMoreTutorials panel when correction has a list of LearningMoreTutorials elements', async function () {
      // given
      correction.setProperties({
        learningMoreTutorials: [{ titre: 'Ceci est un tuto', duration: '20:00:00', type: 'video' }],
      });

      // when
      await render(
        hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
      );

      // then
      expect(find('.learning-more-panel__container')).to.exist;
    });

    context('when the answer is OK', () => {
      it('should neither display “Bientot ici des tutos“ nor hints nor any tutorials', async function () {
        // given
        answer.setProperties({
          result: 'ok',
          isResultNotOk: false,
        });

        // when
        await render(
          hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
        );

        // then
        expect(find('.tutorial-panel')).to.not.exist;
        expect(find('.learning-more-panel__container')).to.not.exist;
        expect(find('.comparison-window__default-message-container')).to.not.exist;
      });
    });

    context('the correction has no hints nor tutorials at all', function () {
      it('should render “Bientot des tutos”', async function () {
        // given
        correction.setProperties({
          solution: '2,3',
          noHintsNorTutorialsAtAll: true,
        });

        // when
        await render(
          hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
        );

        // then
        expect(find('.comparison-windows-content-body-default-message-container__default-message-title')).to.exist;
      });
    });

    context('when the correction has a hint or a tutorial or a learninMoreTutorial', function () {
      it('should not render a hint or a tutorial', async function () {
        // given
        correction.setProperties({
          learningMoreTutorials: [{ titre: 'Ceci est un tuto', duration: '20:00:00', type: 'video' }],
        });

        // when
        await render(
          hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
        );

        // then
        expect(find('.tutorial-panel')).to.exist;
        expect(find('.tutorial-panel__hint-container')).to.not.exist;
        expect(find('.tutorial-panel__tutorial-item')).to.not.exist;
      });
    });

    describe('solution rendering', function () {
      it('should not render corrected answers when challenge has no type', async function () {
        // when
        await render(
          hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
        );
        // then
        expect(find('div[data-test-id="comparison-window__corrected-answers--qroc"]')).to.not.exist;
      });

      describe('when challenge type is QROC', function () {
        describe('and challenge is not autoReply', async function () {
          it('should display answers', async function () {
            // given
            challenge = EmberObject.create({ type: 'QROC', autoReply: false });
            answer.set('challenge', challenge);

            // when
            await render(
              hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
            );

            // then
            expect(find('div[data-test-id="comparison-window__corrected-answers--qroc"]')).to.exist;
          });
        });

        describe('and challenge is autoReply', async function () {
          it('should hide answers when correction has no solutionToDisplay', async function () {
            // given
            challenge = EmberObject.create({ type: 'QROC', autoReply: true });
            answer.set('challenge', challenge);

            // when
            await render(
              hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
            );

            // then
            expect(find('.correction-qroc-box__answer')).to.not.exist;
          });

          it('should display answers when correction has solutionToDisplay', async function () {
            // given
            challenge = EmberObject.create({ type: 'QROC', autoReply: true });
            correction = EmberObject.create({ solution: 'solution', solutionToDisplay: 'solutionToDisplay' });
            answer.set('challenge', challenge);
            answer.set('correction', correction);

            // when
            await render(
              hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
            );

            // then
            expect(find('div[data-test-id="comparison-window__corrected-answers--qroc"]')).to.exist;
          });
        });
      });

      it('should render corrected answers when challenge type is QROCM-ind', async function () {
        // given
        challenge = EmberObject.create({ type: 'QROCM-ind', proposals: '' });
        correction.set('solution', '');
        answer.set('challenge', challenge);
        // when
        await render(
          hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
        );
        // then
        expect(find('div[data-test-id="comparison-window__corrected-answers--qrocm"]')).to.exist;
      });

      it('should render corrected answers when challenge type is QCM', async function () {
        // given
        challenge = EmberObject.create({ type: 'QCM' });
        answer.set('challenge', challenge);
        // when
        await render(
          hbs`<ComparisonWindow @answer={{this.answer}} @closeComparisonWindow={{this.closeComparisonWindow}} />`
        );
        // then
        expect(find('.qcm-solution-panel')).to.exist;
      });
    });
  });
});
