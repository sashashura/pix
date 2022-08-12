// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'service'.
const service = require('../../../../lib/domain/services/solution-service-qcu');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | SolutionServiceQCU ', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('if solution type is QCU', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return `AnswerStatus.OK` when answer and solution are equal', function () {
      expect(service.match('same value', 'same value')).to.deep.equal(AnswerStatus.OK);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return `AnswerStatus.KO` when answer and solution are different', function () {
      expect(service.match('answer value', 'different solution value')).to.deep.equal(AnswerStatus.KO);
    });
  });
});
