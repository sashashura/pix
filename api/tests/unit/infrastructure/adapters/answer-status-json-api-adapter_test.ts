// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatusJsonApiAdapter = require('../../../../lib/infrastructure/adapters/answer-status-json-api-adapter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('chai');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('AnswerStatusJsonApiAdapter', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#adapt', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.OK to "ok"', function () {
      const answerStatus = AnswerStatus.OK;
      const result = AnswerStatusJsonApiAdapter.adapt(answerStatus);
      expect(result).to.equals('ok');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.KO to "ko"', function () {
      const answerStatus = AnswerStatus.KO;
      const result = AnswerStatusJsonApiAdapter.adapt(answerStatus);
      expect(result).to.equals('ko');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.PARTIALLY to "partially"', function () {
      const answerStatus = AnswerStatus.PARTIALLY;
      const result = AnswerStatusJsonApiAdapter.adapt(answerStatus);
      expect(result).to.equals('partially');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.TIMEDOUT to "timedout"', function () {
      const answerStatus = AnswerStatus.TIMEDOUT;
      const result = AnswerStatusJsonApiAdapter.adapt(answerStatus);
      expect(result).to.equals('timedout');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.FOCUSEDOUT to "focusedOut"', function () {
      const answerStatus = AnswerStatus.FOCUSEDOUT;
      const result = AnswerStatusJsonApiAdapter.adapt(answerStatus);
      expect(result).to.equals('focusedOut');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.SKIPPED to "aband"', function () {
      const answerStatus = AnswerStatus.SKIPPED;
      const result = AnswerStatusJsonApiAdapter.adapt(answerStatus);
      expect(result).to.equals('aband');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.UNIMPLEMENTED to "unimplemented"', function () {
      const answerStatus = AnswerStatus.UNIMPLEMENTED;
      const result = AnswerStatusJsonApiAdapter.adapt(answerStatus);
      expect(result).to.equals('unimplemented');
    });
  });
});
