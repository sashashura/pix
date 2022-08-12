// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareDat... Remove this comment to see the full error message
const { prepareDataForInsert } = require('../../../scripts/create-users-accounts-for-contest');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | create-users-accounts-for-contest.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#prepareDataForInsert', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should trim firstName, lastName, email and password', function () {
      // given
      const data = [
        {
          firstName: '  Salim    ',
          lastName: ' Bienléongle     ',
          email: '  salim@example.net  ',
          password: '     pix123   ',
        },
        { firstName: '  Samantha      ', lastName: '  Lo ', email: '  lo@example.net  ', password: '     pixou123   ' },
      ];

      // when
      const result = prepareDataForInsert(data);

      // then
      expect(result).to.deep.equal([
        {
          firstName: 'Salim',
          lastName: 'Bienléongle',
          email: 'salim@example.net',
          password: 'pix123',
        },
        { firstName: 'Samantha', lastName: 'Lo', email: 'lo@example.net', password: 'pixou123' },
      ]);
    });
  });
});
