// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userEmailR... Remove this comment to see the full error message
const userEmailRepository = require('../../../../lib/infrastructure/repositories/user-email-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
const EmailModificationDemand = require('../../../../lib/domain/models/EmailModificationDemand');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | UserEmailRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveEmailModificationDemand', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save an email modification demand', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const newEmail = 'user@example.net';
      const code = '999999';

      // when
      const key = await userEmailRepository.saveEmailModificationDemand({ userId, code, newEmail });

      // then
      expect(key).to.equal(userId);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getEmailModificationDemandByUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve the email modification demand if it exists', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const newEmail = 'user@example.net';
      const code = '999999';

      await userEmailRepository.saveEmailModificationDemand({ userId, code, newEmail });

      // when
      const result = await userEmailRepository.getEmailModificationDemandByUserId(userId);

      // then
      expect(result).to.deep.equal({ code, newEmail });
      expect(result).to.be.instanceOf(EmailModificationDemand);
    });
  });
});
