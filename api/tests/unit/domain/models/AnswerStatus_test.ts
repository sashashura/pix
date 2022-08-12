// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('chai');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('AnswerStatus', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isOK', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatus.OK', function () {
      expect(AnswerStatus.OK.isOK()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatuses KO, SKIPPED, PARTIALLY, TIMEDOUT, FOCUSEDOUT and UNIMPLEMENTED', function () {
      expect(AnswerStatus.KO.isOK()).to.be.false;
      expect(AnswerStatus.SKIPPED.isOK()).to.be.false;
      expect(AnswerStatus.PARTIALLY.isOK()).to.be.false;
      expect(AnswerStatus.TIMEDOUT.isOK()).to.be.false;
      expect(AnswerStatus.FOCUSEDOUT.isOK()).to.be.false;
      expect(AnswerStatus.UNIMPLEMENTED.isOK()).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isKO', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatus.KO', function () {
      expect(AnswerStatus.KO.isKO()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatuses OK, SKIPPED, PARTIALLY, TIMEDOUT, FOCUSEDOUT and UNIMPLEMENTED', function () {
      expect(AnswerStatus.OK.isKO()).to.be.false;
      expect(AnswerStatus.SKIPPED.isKO()).to.be.false;
      expect(AnswerStatus.PARTIALLY.isKO()).to.be.false;
      expect(AnswerStatus.TIMEDOUT.isKO()).to.be.false;
      expect(AnswerStatus.FOCUSEDOUT.isKO()).to.be.false;
      expect(AnswerStatus.UNIMPLEMENTED.isKO()).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isSKIPPED', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatus.SKIPPED', function () {
      expect(AnswerStatus.SKIPPED.isSKIPPED()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatuses OK, KO, PARTIALLY, TIMEDOUT, FOCUSEDOUT and UNIMPLEMENTED', function () {
      expect(AnswerStatus.OK.isSKIPPED()).to.be.false;
      expect(AnswerStatus.KO.isSKIPPED()).to.be.false;
      expect(AnswerStatus.PARTIALLY.isSKIPPED()).to.be.false;
      expect(AnswerStatus.TIMEDOUT.isSKIPPED()).to.be.false;
      expect(AnswerStatus.FOCUSEDOUT.isSKIPPED()).to.be.false;
      expect(AnswerStatus.UNIMPLEMENTED.isSKIPPED()).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isPARTIALLY', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatus.PARTIALLY', function () {
      expect(AnswerStatus.PARTIALLY.isPARTIALLY()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatuses OK, KO, SKIPPED, TIMEDOUT, FOCUSEDOUTand UNIMPLEMENTED', function () {
      expect(AnswerStatus.OK.isPARTIALLY()).to.be.false;
      expect(AnswerStatus.KO.isPARTIALLY()).to.be.false;
      expect(AnswerStatus.SKIPPED.isPARTIALLY()).to.be.false;
      expect(AnswerStatus.TIMEDOUT.isPARTIALLY()).to.be.false;
      expect(AnswerStatus.FOCUSEDOUT.isPARTIALLY()).to.be.false;
      expect(AnswerStatus.UNIMPLEMENTED.isPARTIALLY()).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isTIMEDOUT', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatus.TIMEDOUT', function () {
      expect(AnswerStatus.TIMEDOUT.isTIMEDOUT()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatuses OK, KO, SKIPPED, PARTIALLY, FOCUSEDOUT and UNIMPLEMENTED', function () {
      expect(AnswerStatus.OK.isTIMEDOUT()).to.be.false;
      expect(AnswerStatus.KO.isTIMEDOUT()).to.be.false;
      expect(AnswerStatus.SKIPPED.isTIMEDOUT()).to.be.false;
      expect(AnswerStatus.PARTIALLY.isTIMEDOUT()).to.be.false;
      expect(AnswerStatus.FOCUSEDOUT.isTIMEDOUT()).to.be.false;
      expect(AnswerStatus.UNIMPLEMENTED.isTIMEDOUT()).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isUNIMPLEMENTED', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatus.UNIMPLEMENTED', function () {
      expect(AnswerStatus.UNIMPLEMENTED.isUNIMPLEMENTED()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatuses OK, KO, SKIPPED, PARTIALLY, FOCUSEDOUT and TIMEDOUT', function () {
      expect(AnswerStatus.OK.isUNIMPLEMENTED()).to.be.false;
      expect(AnswerStatus.KO.isUNIMPLEMENTED()).to.be.false;
      expect(AnswerStatus.SKIPPED.isUNIMPLEMENTED()).to.be.false;
      expect(AnswerStatus.PARTIALLY.isUNIMPLEMENTED()).to.be.false;
      expect(AnswerStatus.TIMEDOUT.isUNIMPLEMENTED()).to.be.false;
      expect(AnswerStatus.FOCUSEDOUT.isUNIMPLEMENTED()).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isFailed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatus.OK', function () {
      expect(AnswerStatus.OK.isFailed()).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatuses KO, SKIPPED, PARTIALLY, TIMEDOUT, FOCUSEDOUT and UNIMPLEMENTED', function () {
      expect(AnswerStatus.KO.isFailed()).to.be.true;
      expect(AnswerStatus.SKIPPED.isFailed()).to.be.true;
      expect(AnswerStatus.PARTIALLY.isFailed()).to.be.true;
      expect(AnswerStatus.TIMEDOUT.isFailed()).to.be.true;
      expect(AnswerStatus.FOCUSEDOUT.isFailed()).to.be.true;
      expect(AnswerStatus.UNIMPLEMENTED.isFailed()).to.be.true;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('AnswerStatus#isFOCUSEDOUT', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true with AnswerStatus.FOCUSEDOUT', function () {
      expect(AnswerStatus.FOCUSEDOUT.isFOCUSEDOUT()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false with AnswerStatuses OK, KO, SKIPPED, PARTIALLY, TIMEDOUT and UNIMPLEMENTED', function () {
      expect(AnswerStatus.OK.isFOCUSEDOUT()).to.be.false;
      expect(AnswerStatus.KO.isFOCUSEDOUT()).to.be.false;
      expect(AnswerStatus.SKIPPED.isFOCUSEDOUT()).to.be.false;
      expect(AnswerStatus.PARTIALLY.isFOCUSEDOUT()).to.be.false;
      expect(AnswerStatus.TIMEDOUT.isFOCUSEDOUT()).to.be.false;
      expect(AnswerStatus.UNIMPLEMENTED.isFOCUSEDOUT()).to.be.false;
    });
  });
});
