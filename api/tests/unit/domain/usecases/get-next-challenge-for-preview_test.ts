// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getNextChallengeForPreview = require('../../../../lib/domain/usecases/get-next-challenge-for-preview');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-next-challenge-for-preview', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getNextChallengeForPreview', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should trigger an AssessmentEndedError', function () {
      // when
      const promise = getNextChallengeForPreview();

      // then
      return expect(promise).to.be.rejectedWith(AssessmentEndedError);
    });
  });
});
