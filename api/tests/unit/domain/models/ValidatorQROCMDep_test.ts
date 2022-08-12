// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const solutionServiceQrocmDep = require('../../../../lib/domain/services/solution-service-qrocm-dep');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
const Validation = require('../../../../lib/domain/models/Validation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROCMDep = require('../../../../lib/domain/models/ValidatorQROCMDep');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ValidatorQROCMDep', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(solutionServiceQrocmDep, 'match');
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
      solutionServiceQrocmDep.match.returns(AnswerStatus.OK);
      solution = domainBuilder.buildSolution({
        type: 'QROCM-dep',
        value: 'Google:\n- abcd\n- efgh\n- hijk\nYahoo:\n- lmno\n- pqrs\n',
        isT1Enabled: true,
        isT2Enabled: true,
        isT3Enabled: true,
        scoring: '1: acquix\n2: acquix',
      });

      uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected();
      validator = new ValidatorQROCMDep({ solution: solution });

      // when
      validation = validator.assess({ answer: uncorrectedAnswer });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call solutionServiceQROCMDep', function () {
      // then
      expect(solutionServiceQrocmDep.match).to.have.been.calledWith({ answerValue: uncorrectedAnswer.value, solution });
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
