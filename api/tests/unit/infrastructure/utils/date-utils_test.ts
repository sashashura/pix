// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
const { isValidDate, convertDateValue } = require('../../../../lib/infrastructure/utils/date-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | date-utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isValidDate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Valid cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should accept a valid date only string with format YYYY-MM-DD', function () {
        expect(isValidDate('2008-05-13', 'YYYY-MM-DD')).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should accept a date object', function () {
        expect(isValidDate(new Date(), 'YYYY-MM-DD')).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Invalid cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept a date with impossible day values', function () {
        expect(isValidDate('2008-02-31', 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept a datetime string', function () {
        expect(isValidDate('2008-05-13T00:00:00Z', 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept a date without day', function () {
        expect(isValidDate('2008-05', 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept a date without month and day', function () {
        expect(isValidDate('2008', 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept any string starting with a number', function () {
        expect(isValidDate('2not a date', 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept an invalid formated date string', function () {
        expect(isValidDate('13/05/2008', 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept an invalid date string', function () {
        expect(isValidDate('Not a date', 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept a null value', function () {
        expect(isValidDate(null, 'YYYY-MM-DD')).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should NOT accept a undefined value', function () {
        expect(isValidDate(undefined, 'YYYY-MM-DD')).to.be.false;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#convertDateValue', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when alternativeInputFormat does not exist', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when dateValue does not match inputFormat', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return null', function () {
          expect(
            convertDateValue({ dateString: '1980-05-05', inputFormat: 'DD/MM/YYYY', outputFormat: 'YYYY-MM-DD' })
          ).to.be.null;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when dateValue matches inputFormat', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return converted date', function () {
          expect(
            convertDateValue({ dateString: '05/05/1980', inputFormat: 'DD/MM/YYYY', outputFormat: 'YYYY-MM-DD' })
          ).to.equal('1980-05-05');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when alternativeInputFormat exists', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when dateValue does not match nor inputFormat, nor alternativeInputFormat', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return null', function () {
          expect(
            convertDateValue({
              dateString: '1980-05-05',
              inputFormat: 'DD/MM/YYYY',
              alternativeInputFormat: 'DD/MM/YY',
              outputFormat: 'YYYY-MM-DD',
            })
          ).to.be.null;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when dateValue matches inputFormat', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return converted date', function () {
          expect(
            convertDateValue({
              dateString: '05/05/1980',
              inputFormat: 'DD/MM/YYYY',
              alternativeInputFormat: 'DD/MM/YY',
              outputFormat: 'YYYY-MM-DD',
            })
          ).to.equal('1980-05-05');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when dateValue matches alternativeInputFormat with 2 digits year', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return converted date with year 2000 if input year < the current year', function () {
          const currentYear = new Date().getFullYear();
          const currentTwoDigitYear = currentYear - 2000;
          const inputDate = '05/05/' + (currentTwoDigitYear - 1);
          const expectedDate = currentYear - 1 + '-05-05';
          expect(
            convertDateValue({
              dateString: inputDate,
              inputFormat: 'DD/MM/YYYY',
              alternativeInputFormat: 'DD/MM/YY',
              outputFormat: 'YYYY-MM-DD',
            })
          ).to.equal(expectedDate);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return converted date with year 1900 if input year >= the current year', function () {
          const currentYear = new Date().getFullYear();
          const currentTwoDigitYear = currentYear - 2000;
          const inputDate = '05/05/' + currentTwoDigitYear;
          const expectedDate = 1900 + currentTwoDigitYear + '-05-05';
          expect(
            convertDateValue({
              dateString: inputDate,
              inputFormat: 'DD/MM/YYYY',
              alternativeInputFormat: 'DD/MM/YY',
              outputFormat: 'YYYY-MM-DD',
            })
          ).to.equal(expectedDate);
        });
      });
    });
  });
});
