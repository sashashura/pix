// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MailingPro... Remove this comment to see the full error message
const MailingProvider = require('../../../../lib/infrastructure/mailers/MailingProvider');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Mailers | MailingProvider', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sendEmail', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // given
      const mailingProvider = new MailingProvider();

      // when
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
      const result = mailingProvider.sendEmail({});

      // then
      return expect(result).to.be.rejected;
    });
  });
});
