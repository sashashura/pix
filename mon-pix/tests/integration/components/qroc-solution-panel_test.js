import EmberObject from '@ember/object';
import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | QROC solution panel', function () {
  setupIntlRenderingTest();

  describe('When format is paragraph', function () {
    it('should display disabled textarea', async function () {
      // given
      const challenge = EmberObject.create({ format: 'paragraphe' });
      const answer = EmberObject.create({ challenge });
      const solution = '4';
      this.set('answer', answer);
      this.set('solution', solution);

      //when
      await render(hbs`<QrocSolutionPanel @answer={{this.answer}} @solution={{this.solution}}/>`);

      // then
      expect(find('input')).to.not.exist;
      expect(find('textarea.correction-qroc-box-answer--paragraph')).to.have.attr('disabled');
      expect(find('.correction-qroc-box-answer').getAttribute('rows')).to.equal('5');
    });
  });

  describe('When format is sentence', function () {
    it('should display disabled input', async function () {
      // given
      const challenge = EmberObject.create({ format: 'phrase' });
      const answer = EmberObject.create({ challenge });
      const solution = '4';
      this.set('answer', answer);
      this.set('solution', solution);

      //when
      await render(hbs`<QrocSolutionPanel @answer={{this.answer}} @solution={{this.solution}}/>`);

      // then
      expect(find('input.correction-qroc-box-answer--sentence')).to.have.attr('disabled');
    });
  });

  describe('When format is neither a paragraph nor a sentence', function () {
    it(`should display a disabled input with expected size`, async function () {
      // given
      const challenge = EmberObject.create({ format: '' });
      const answer = EmberObject.create({ id: 'answer_id', result: 'ok', value: 'test', challenge });
      const solution = '4';
      this.set('answer', answer);
      this.set('solution', solution);

      //when
      await render(hbs`<QrocSolutionPanel @answer={{this.answer}} @solution={{this.solution}}/>`);

      // then
      expect(find('textarea.correction-qroc-box-answer--paragraph')).to.not.exist;
      expect(find('textarea.correction-qroc-box-answer--sentence')).to.not.exist;
      expect(find('input.correction-qroc-box-answer')).to.have.attr('disabled');
      expect(find('input.correction-qroc-box-answer').getAttribute('size')).to.equal(answer.value.length.toString());
    });
  });

  [{ format: 'petit' }, { format: 'phrase' }, { format: 'paragraphe' }, { format: 'unreferenced_format' }].forEach(
    (data) => {
      describe(`Whatever the format (testing "${data.format}" format)`, function () {
        describe('When the answer is correct', function () {
          beforeEach(async function () {
            // given
            const assessment = EmberObject.create({ id: 'assessment_id' });
            const challenge = EmberObject.create({ id: 'challenge_id', format: data.format });
            const answer = EmberObject.create({ id: 'answer_id', result: 'ok', value: 'test', assessment, challenge });
            const solution = '4';
            this.set('answer', answer);
            this.set('solution', solution);

            //when
            await render(hbs`<QrocSolutionPanel @answer={{this.answer}} @solution={{this.solution}}/>`);
          });

          it('should display the answer in bold green', async function () {
            // then
            expect(find('.correction-qroc-box-answer')).to.exist;
            expect(find('.correction-qroc-box__answer')).to.exist;
            expect(find('.correction-qroc-box-answer--correct')).to.exist;
          });

          it('should not display the solution', async function () {
            // then
            expect(find('.comparison-window-solution')).to.not.exist;
          });
        });

        describe('When the answer is wrong', function () {
          beforeEach(async function () {
            // given
            const assessment = EmberObject.create({ id: 'assessment_id' });
            const challenge = EmberObject.create({ id: 'challenge_id', format: data.format });
            const answer = EmberObject.create({ id: 'answer_id', result: 'ko', assessment, challenge });
            const solution = '4';
            this.set('answer', answer);
            this.set('solution', solution);

            // when
            await render(hbs`<QrocSolutionPanel @answer={{this.answer}} @solution={{this.solution}}/>`);
          });

          it('should display the false answer with line-through', function () {
            // then
            expect(find('.correction-qroc-box-answer')).to.exist;
            expect(find('.correction-qroc-box__answer')).to.exist;
            expect(find('.correction-qroc-box-answer--wrong')).to.exist;
          });

          it('should display the solution with an arrow and the solution in bold green', function () {
            const blockSolution = find('.comparison-window-solution');
            const solutionText = find('.comparison-window-solution__text');

            // then
            expect(blockSolution).to.exist;
            expect(solutionText).to.exist;
          });
        });

        describe('When the answer was not given', function () {
          const EMPTY_DEFAULT_MESSAGE = 'Pas de réponse';

          beforeEach(async function () {
            // given
            const assessment = EmberObject.create({ id: 'assessment_id' });
            const challenge = EmberObject.create({ id: 'challenge_id', format: data.format });
            const answer = EmberObject.create({
              id: 'answer_id',
              value: '#ABAND#',
              result: 'aband',
              assessment,
              challenge,
            });
            const solution = '4';
            this.set('answer', answer);
            this.set('solution', solution);
            this.set('isResultWithoutAnswer', true);

            // when
            await render(hbs`<QrocSolutionPanel @answer={{this.answer}} @solution={{this.solution}}/>`);
          });

          it('should display "Pas de réponse" in italic', function () {
            // then
            const answerBlock = find('.correction-qroc-box-answer');

            expect(answerBlock).to.exist;
            expect(answerBlock.value).to.equal(EMPTY_DEFAULT_MESSAGE);
            expect(find('.correction-qroc-box-answer--aband')).to.exist;
          });
        });
      });
    }
  );

  context('when user has not answerd correctly', function () {
    context('when solutionToDisplay is indicated', function () {
      it('should show the solution from solutionToDisplay', async function () {
        //Given
        const answer = EmberObject.create({ result: 'ko' });
        const solutionToDisplay = 'MEILLEURE EXPLICATION !';
        const solution = 'SOLUTION !';
        const challenge = EmberObject.create();
        this.set('answer', answer);
        this.set('solution', solution);
        this.set('solutionToDisplay', solutionToDisplay);
        this.set('challenge', challenge);

        // When
        await render(
          hbs`<QrocSolutionPanel @answer={{this.answer}} @challenge={{this.challenge}} @solution={{this.solution}} @solutionToDisplay={{this.solutionToDisplay}}/>`
        );

        // Then
        expect(find('.comparison-window-solution')).to.exist;
        expect(find('.comparison-window-solution__text').textContent).to.contains(solutionToDisplay);
      });
    });

    context('when solutionToDisplay is not indicated', function () {
      it('should show the solution', async function () {
        // Given
        const answer = EmberObject.create({ result: 'ko' });
        const solutionToDisplay = null;
        const solution = 'SOLUTION !';
        const challenge = EmberObject.create();
        this.set('answer', answer);
        this.set('solution', solution);
        this.set('solutionToDisplay', solutionToDisplay);
        this.set('challenge', challenge);

        // When
        await render(
          hbs`<QrocSolutionPanel @answer={{this.answer}} @challenge={{this.challenge}} @solution={{this.solution}} @solutionToDisplay={{this.solutionToDisplay}}/>`
        );

        // Then
        expect(find('.comparison-window-solution')).to.exist;
        expect(find('.comparison-window-solution__text').textContent).to.contains(solution);
      });
    });
  });

  context('when user has answerd correctly', function () {
    context('when solutionToDisplay is indicated', function () {
      it('should not show the solution text', async function () {
        //Given
        const answer = EmberObject.create({ result: 'ok' });
        const solutionToDisplay = 'MEILLEURE EXPLICATION !';
        const solution = 'SOLUTION !';
        const challenge = EmberObject.create();
        this.set('answer', answer);
        this.set('solution', solution);
        this.set('solutionToDisplay', solutionToDisplay);
        this.set('challenge', challenge);

        // When
        await render(
          hbs`<QrocSolutionPanel @answer={{this.answer}} @challenge={{this.challenge}} @solution={{this.solution}} @solutionToDisplay={{this.solutionToDisplay}}/>`
        );

        // Then
        expect(find('.comparison-window-solution')).to.not.exist;
      });
    });
  });

  context('when challenge is autoReply without solution', function () {
    let challenge, solution;
    beforeEach(function () {
      challenge = EmberObject.create({ autoReply: true });
      solution = null;
    });

    it('should not show the block answers and solution if solutionToDisplay not exists', async function () {
      //Given
      const answer = EmberObject.create({ result: 'ko' });
      const solutionToDisplay = null;
      this.set('answer', answer);
      this.set('solution', solution);
      this.set('solutionToDisplay', solutionToDisplay);
      this.set('challenge', challenge);

      // When
      await render(
        hbs`<QrocSolutionPanel @answer={{this.answer}} @challenge={{this.challenge}} @solution={{this.solution}} @solutionToDisplay={{this.solutionToDisplay}}/>`
      );

      // Then
      expect(find('.correction-qroc-box')).to.not.exist;
    });

    it('should show the solution if solutionToDisplay exists', async function () {
      //Given
      const answer = EmberObject.create({ result: 'ko' });
      const solutionToDisplay = 'TADA !';
      this.set('answer', answer);
      this.set('solution', solution);
      this.set('solutionToDisplay', solutionToDisplay);
      this.set('challenge', challenge);

      // When
      await render(
        hbs`<QrocSolutionPanel @answer={{this.answer}} @challenge={{this.challenge}} @solution={{this.solution}} @solutionToDisplay={{this.solutionToDisplay}}/>`
      );

      // Then
      expect(find('.correction-qroc-box')).to.exist;
      expect(find('.comparison-window-solution')).to.exist;
      expect(find('.comparison-window-solution__text').textContent).to.contains(solutionToDisplay);
    });
  });
});
