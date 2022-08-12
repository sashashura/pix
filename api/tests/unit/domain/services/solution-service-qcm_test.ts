// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'service'.
const service = require('../../../../lib/domain/services/solution-service-qcm');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | SolutionServiceQCM ', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('if solution type is QCM', function () {
    const successfulCases = [
      { answerValue: '1', solutionValue: '1' },
      { answerValue: '1, 2', solutionValue: '1, 2' },
      { answerValue: '1, 2, 3', solutionValue: '1, 2, 3' },
      { answerValue: '1,2,3', solutionValue: '1,2,3' },
      { answerValue: '3, 2, 1', solutionValue: '1, 2, 3' },
      { answerValue: '1,2,3', solutionValue: '1, 2, 3' },
      { answerValue: '1,   2,   3   ', solutionValue: '1, 2, 3' },
      { answerValue: '1, 2, 3', solutionValue: '1, 2, 3' },
    ];

    // eslint-disable-next-line mocha/no-setup-in-describe
    successfulCases.forEach(({ answerValue, solutionValue }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(
        'should return "ok" when answer is "' + answerValue + '" and solution is "' + solutionValue + '"',
        function () {
          const result = service.match(answerValue, solutionValue);
          expect(AnswerStatus.isOK(result)).to.be.true;
        }
      );
    });

    const failedCases = [
      { answerValue: '2', solutionValue: '1' },
      { answerValue: '1, 3', solutionValue: '1, 2' },
      { answerValue: '1, 2, 3', solutionValue: '1, 2' },
      { answerValue: '3, 1', solutionValue: '1, 2' },
    ];

    // eslint-disable-next-line mocha/no-setup-in-describe
    failedCases.forEach(({ answerValue, solutionValue }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(
        'should return "ko" when answer is "' + answerValue + '" and solution is "' + solutionValue + '"',
        function () {
          const result = service.match(answerValue, solutionValue);
          expect(AnswerStatus.isKO(result)).to.be.true;
        }
      );
    });
  });
});
