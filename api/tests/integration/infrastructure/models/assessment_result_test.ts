// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, knex } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfAssessmentResults = require('../../../../lib/infrastructure/orm-models/AssessmentResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Models | BookshelfAssessmentResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('validation', function () {
    let rawData: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      rawData = {
        emitter: '',
        status: null,
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('assessment-results').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('the status field validated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be saved', function () {
        // given
        rawData.status = 'validated';
        const assessmentResult = new BookshelfAssessmentResults(rawData);

        // when
        const promise = assessmentResult.save();

        // then
        return promise.catch((_: $TSFixMe) => {
          sinon.assert.fail(new Error('Should not fail with validated type'));
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('the status field rejected', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be saved', function () {
        // given
        rawData.status = 'rejected';
        const assessmentResult = new BookshelfAssessmentResults(rawData);

        // when
        const promise = assessmentResult.save();

        // then
        return promise.catch((_: $TSFixMe) => {
          sinon.assert.fail(new Error('Should not fail with rejected type'));
        });
      });
    });
  });
});
