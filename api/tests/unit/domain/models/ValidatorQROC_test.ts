// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const solutionServiceQroc = require('../../../../lib/domain/services/solution-service-qroc');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
const Validation = require('../../../../lib/domain/models/Validation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROC = require('../../../../lib/domain/models/ValidatorQROC');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ValidatorQROC', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(solutionServiceQroc, 'match');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#assess', function () {
    let uncorrectedAnswer: $TSFixMe;
    let validation: $TSFixMe;
    let validator;
    let solution: $TSFixMe;
    let challengeFormat: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      solutionServiceQroc.match.returns(AnswerStatus.OK);
      solution = domainBuilder.buildSolution({ type: 'QROC' });

      uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected();
      validator = new ValidatorQROC({ solution: solution });

      // when
      validation = validator.assess({ answer: uncorrectedAnswer });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call solutionServiceQROC', function () {
      // then
      expect(solutionServiceQroc.match).to.have.been.calledWith({
        answer: uncorrectedAnswer.value,
        solution: solution,
        challengeFormat,
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a validation object with the returned status', function () {
      const expectedValidation = domainBuilder.buildValidation({
        result: AnswerStatus.OK,
        resultDetails: null,
      });

      // then
      expect(validation).to.be.an.instanceOf(Validation);
      expect(validation).to.deep.equal(expectedValidation);
    });
  });
});
