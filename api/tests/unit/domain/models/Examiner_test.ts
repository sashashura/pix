// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../../../lib/domain/models/Answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Examiner'.
const Examiner = require('../../../../lib/domain/models/Examiner');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Examiner', function () {
  const challengeFormat = 'nombre';
  const validator = {
    assess: () => undefined,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    validator.assess = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#evaluate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when answer is SKIPPED', function () {
      let uncorrectedAnswer: $TSFixMe;
      let correctedAnswer: $TSFixMe;
      let examiner;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected({ value: '#ABAND#' });
        examiner = new Examiner({ validator });

        // when
        correctedAnswer = examiner.evaluate({ answer: uncorrectedAnswer, challengeFormat });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an answer with skipped as result and null as resultDetails', function () {
        const expectedAnswer = new Answer(uncorrectedAnswer);
        expectedAnswer.result = AnswerStatus.SKIPPED;
        expectedAnswer.resultDetails = null;

        // then
        expect(correctedAnswer).to.be.an.instanceOf(Answer);
        expect(correctedAnswer).to.deep.equal(expectedAnswer);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not call validator.assess', function () {
        // then
        expect(validator.assess).to.not.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when answer is correct and TIMEOUT', function () {
      let uncorrectedAnswer: $TSFixMe;
      let correctedAnswer: $TSFixMe;
      let examiner;
      let validation: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        validation = domainBuilder.buildValidation({ result: AnswerStatus.OK });
        (validator.assess as $TSFixMe).returns(validation);
        uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected({ timeout: -12 });
        examiner = new Examiner({ validator });

        // when
        correctedAnswer = examiner.evaluate({ answer: uncorrectedAnswer, challengeFormat });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an answer with TIMEOUT as result, and the correct resultDetails', function () {
        const expectedAnswer = new Answer(uncorrectedAnswer);
        expectedAnswer.result = AnswerStatus.TIMEDOUT;
        expectedAnswer.resultDetails = validation.resultDetails;

        // then
        expect(correctedAnswer).to.be.an.instanceOf(Answer);
        expect(correctedAnswer).to.deep.equal(expectedAnswer);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call validator.assess with answer to assess validity of answer', function () {
        // then
        expect(validator.assess).to.have.been.calledWithExactly({ answer: uncorrectedAnswer, challengeFormat });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when answer is correct and FOCUSEDOUT', function () {
      let uncorrectedAnswer: $TSFixMe;
      let correctedAnswer;
      let examiner: $TSFixMe;
      let validation: $TSFixMe;
      let isFocusedChallenge: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        validation = domainBuilder.buildValidation({ result: AnswerStatus.OK });
        (validator.assess as $TSFixMe).returns(validation);
        uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected({ isFocusedOut: true });
        examiner = new Examiner({ validator });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and is a focused challenge', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          isFocusedChallenge = true;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an answer with FOCUSEDOUT as result when the assessment is a certification, and the correct resultDetails', function () {
          // given
          const expectedAnswer = new Answer(uncorrectedAnswer);
          expectedAnswer.result = AnswerStatus.FOCUSEDOUT;
          expectedAnswer.resultDetails = validation.resultDetails;

          // when
          correctedAnswer = examiner.evaluate({
            answer: uncorrectedAnswer,
            challengeFormat,
            isFocusedChallenge,
            isCertificationEvaluation: true,
          });

          // then
          expect(correctedAnswer).to.be.an.instanceOf(Answer);
          expect(correctedAnswer).to.deep.equal(expectedAnswer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an answer with OK as result when the assessment is not a certification, and the correct resultDetails', function () {
          // given
          const expectedAnswer = new Answer(uncorrectedAnswer);
          expectedAnswer.result = AnswerStatus.OK;
          expectedAnswer.resultDetails = validation.resultDetails;

          // when
          correctedAnswer = examiner.evaluate({
            answer: uncorrectedAnswer,
            challengeFormat,
            isFocusedChallenge,
            isCertificationEvaluation: false,
          });

          // then
          expect(correctedAnswer).to.be.an.instanceOf(Answer);
          expect(correctedAnswer).to.deep.equal(expectedAnswer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should call validator.assess with answer to assess validity of answer', function () {
          // when
          examiner.evaluate({
            answer: uncorrectedAnswer,
            challengeFormat,
            isFocusedChallenge,
            isCertificationEvaluation: true,
          });

          // then
          expect(validator.assess).to.have.been.calledWithExactly({ answer: uncorrectedAnswer, challengeFormat });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and is not a focused challenge', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          isFocusedChallenge = false;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an answer with OK as result when the assessment is a certification, and the correct resultDetails', function () {
          // given
          const expectedAnswer = new Answer(uncorrectedAnswer);
          expectedAnswer.result = AnswerStatus.OK;
          expectedAnswer.resultDetails = validation.resultDetails;

          // when
          correctedAnswer = examiner.evaluate({
            answer: uncorrectedAnswer,
            challengeFormat,
            isFocusedChallenge,
            isCertificationEvaluation: true,
          });

          // then
          expect(correctedAnswer).to.be.an.instanceOf(Answer);
          expect(correctedAnswer).to.deep.equal(expectedAnswer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an answer with OK as result when the assessment is not a certification, and the correct resultDetails', function () {
          // given
          const expectedAnswer = new Answer(uncorrectedAnswer);
          expectedAnswer.result = AnswerStatus.OK;
          expectedAnswer.resultDetails = validation.resultDetails;

          // when
          correctedAnswer = examiner.evaluate({
            answer: uncorrectedAnswer,
            challengeFormat,
            isFocusedChallenge,
            isCertificationEvaluation: false,
          });

          // then
          expect(correctedAnswer).to.be.an.instanceOf(Answer);
          expect(correctedAnswer).to.deep.equal(expectedAnswer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should call validator.assess with answer to assess validity of answer', function () {
          // when
          examiner.evaluate({
            answer: uncorrectedAnswer,
            challengeFormat,
            isFocusedChallenge,
            isCertificationEvaluation: true,
          });

          // then
          expect(validator.assess).to.have.been.calledWithExactly({ answer: uncorrectedAnswer, challengeFormat });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when answer is neither SKIPPED nor TIMEOUT', function () {
      let uncorrectedAnswer: $TSFixMe;
      let correctedAnswer: $TSFixMe;
      let examiner;
      let validation: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        validation = domainBuilder.buildValidation({ result: AnswerStatus.OK });
        (validator.assess as $TSFixMe).returns(validation);
        uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected({ timeout: 23, value: 'something true' });
        examiner = new Examiner({ validator });

        // when
        correctedAnswer = examiner.evaluate({ answer: uncorrectedAnswer, challengeFormat });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an answer with the validator‘s result and resultDetails', function () {
        const expectedAnswer = new Answer(uncorrectedAnswer);
        expectedAnswer.result = validation.result;
        expectedAnswer.resultDetails = validation.resultDetails;

        // then
        expect(correctedAnswer).to.be.an.instanceOf(Answer);
        expect(correctedAnswer).to.deep.equal(expectedAnswer);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call validator.assess with answer to assess validity of answer', function () {
        // then
        expect(validator.assess).to.have.been.calledWithExactly({ answer: uncorrectedAnswer, challengeFormat });
      });
    });
  });
});
