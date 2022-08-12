// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const solutionServiceQrocmInd = require('../../../../lib/domain/services/solution-service-qrocm-ind');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
const Validation = require('../../../../lib/domain/models/Validation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROCMInd = require('../../../../lib/domain/models/ValidatorQROCMInd');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ValidatorQROCMInd', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(solutionServiceQrocmInd, 'match');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#assess', function () {
    let uncorrectedAnswer: $TSFixMe;
    let validation: $TSFixMe;
    let validator;
    let solution: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      solutionServiceQrocmInd.match.returns({ result: AnswerStatus.OK, resultDetails: 'resultDetailYAMLString' });
      solution = domainBuilder.buildSolution({ type: 'QROCM-ind' });

      uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected();
      validator = new ValidatorQROCMInd({ solution: solution });

      // when
      validation = validator.assess({ answer: uncorrectedAnswer });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call solutionServiceQROCMInd', function () {
      // then
      expect(solutionServiceQrocmInd.match).to.have.been.calledWith({
        answerValue: uncorrectedAnswer.value,
        solution: solution,
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a validation object with the returned status', function () {
      const expectedValidation = domainBuilder.buildValidation({
        result: AnswerStatus.OK,
        resultDetails: 'resultDetailYAMLString',
      });

      // then
      expect(validation).to.be.an.instanceOf(Validation);
      expect(validation).to.deep.equal(expectedValidation);
    });
  });
});
