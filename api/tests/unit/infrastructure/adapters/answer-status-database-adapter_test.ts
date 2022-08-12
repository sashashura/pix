// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const AnswerStatusDatabaseAdapter = require('../../../../lib/infrastructure/adapters/answer-status-database-adapter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('chai');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('AnswerStatusDatabaseAdapter', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#adapt', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.OK to "ok"', function () {
      const answerStatus = AnswerStatus.OK;
      const result = AnswerStatusDatabaseAdapter.adapt(answerStatus);
      expect(result).to.equals('ok');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.KO to "ko"', function () {
      const answerStatus = AnswerStatus.KO;
      const result = AnswerStatusDatabaseAdapter.adapt(answerStatus);
      expect(result).to.equals('ko');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.PARTIALLY to "partially"', function () {
      const answerStatus = AnswerStatus.PARTIALLY;
      const result = AnswerStatusDatabaseAdapter.adapt(answerStatus);
      expect(result).to.equals('partially');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.TIMEDOUT to "timedout"', function () {
      const answerStatus = AnswerStatus.TIMEDOUT;
      const result = AnswerStatusDatabaseAdapter.adapt(answerStatus);
      expect(result).to.equals('timedout');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.SKIPPED to "aband"', function () {
      const answerStatus = AnswerStatus.SKIPPED;
      const result = AnswerStatusDatabaseAdapter.adapt(answerStatus);
      expect(result).to.equals('aband');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.FOCUSEDOUT to "focusedOut"', function () {
      const answerStatus = AnswerStatus.FOCUSEDOUT;
      const result = AnswerStatusDatabaseAdapter.adapt(answerStatus);
      expect(result).to.equals('focusedOut');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.UNIMPLEMENTED to "unimplemented"', function () {
      const answerStatus = AnswerStatus.UNIMPLEMENTED;
      const result = AnswerStatusDatabaseAdapter.adapt(answerStatus);
      expect(result).to.equals('unimplemented');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#toSQLString', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.OK to "ok"', function () {
      const answerStatus = AnswerStatus.OK;
      const result = AnswerStatusDatabaseAdapter.toSQLString(answerStatus);
      expect(result).to.equals('ok');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.KO to "ko"', function () {
      const answerStatus = AnswerStatus.KO;
      const result = AnswerStatusDatabaseAdapter.toSQLString(answerStatus);
      expect(result).to.equals('ko');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.PARTIALLY to "partially"', function () {
      const answerStatus = AnswerStatus.PARTIALLY;
      const result = AnswerStatusDatabaseAdapter.toSQLString(answerStatus);
      expect(result).to.equals('partially');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.TIMEDOUT to "timedout"', function () {
      const answerStatus = AnswerStatus.TIMEDOUT;
      const result = AnswerStatusDatabaseAdapter.toSQLString(answerStatus);
      expect(result).to.equals('timedout');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.FOCUSEDOUT to "focusedOut"', function () {
      const answerStatus = AnswerStatus.FOCUSEDOUT;
      const result = AnswerStatusDatabaseAdapter.toSQLString(answerStatus);
      expect(result).to.equals('focusedOut');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.SKIPPED to "aband"', function () {
      const answerStatus = AnswerStatus.SKIPPED;
      const result = AnswerStatusDatabaseAdapter.toSQLString(answerStatus);
      expect(result).to.equals('aband');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert AnswerStatus.UNIMPLEMENTED to "unimplemented"', function () {
      const answerStatus = AnswerStatus.UNIMPLEMENTED;
      const result = AnswerStatusDatabaseAdapter.toSQLString(answerStatus);
      expect(result).to.equals('unimplemented');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fromSQLString', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert "ok" to AnswerStatus.OK', function () {
      const answerStatusString = 'ok';
      const result = AnswerStatusDatabaseAdapter.fromSQLString(answerStatusString);
      expect(result.isOK()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert "ko" to AnswerStatus.KO', function () {
      const answerStatusString = 'ko';
      const result = AnswerStatusDatabaseAdapter.fromSQLString(answerStatusString);
      expect(result.isKO()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert "partially" to AnswerStatus.PARTIALLY', function () {
      const answerStatusString = 'partially';
      const result = AnswerStatusDatabaseAdapter.fromSQLString(answerStatusString);
      expect(result.isPARTIALLY()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert "timedout" to AnswerStatus.TIMEDOUT', function () {
      const answerStatusString = 'timedout';
      const result = AnswerStatusDatabaseAdapter.fromSQLString(answerStatusString);
      expect(result.isTIMEDOUT()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert "focusedOut" to AnswerStatus.FOCUSEDOUT', function () {
      const answerStatusString = 'focusedOut';
      const result = AnswerStatusDatabaseAdapter.fromSQLString(answerStatusString);
      expect(result.isFOCUSEDOUT()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert "aband" to AnswerStatus.SKIPPED', function () {
      const answerStatusString = 'aband';
      const result = AnswerStatusDatabaseAdapter.fromSQLString(answerStatusString);
      expect(result.isSKIPPED()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert "unimplemented" to AnswerStatus.UNIMPLEMENTED', function () {
      const answerStatusString = 'unimplemented';
      const result = AnswerStatusDatabaseAdapter.fromSQLString(answerStatusString);
      expect(result.isUNIMPLEMENTED()).to.be.true;
    });
  });
});
