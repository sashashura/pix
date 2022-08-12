// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bcrypt'.
const bcrypt = require('bcrypt');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encryption... Remove this comment to see the full error message
const encryptionService = require('../../../../lib/domain/services/encryption-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
const PasswordNotMatching = require('../../../../lib/domain/errors').PasswordNotMatching;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Encryption', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkPassword', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when password and hash are matching', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve to undefined', async function () {
        // given
        const password = 'my-real-password';
        // eslint-disable-next-line no-sync
        const passwordHash = bcrypt.hashSync(password, 1);

        // when
        const result = await encryptionService.checkPassword({
          password,
          passwordHash,
        });

        // then
        expect(result).to.be.undefined;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when password and hash are not matching', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject a PasswordNotMatching error ', async function () {
        // given
        const password = 'my-expected-password';
        const passwordHash = 'ABCDEF1234';

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(encryptionService.checkPassword)({
          password,
          passwordHash,
        });

        // then
        expect(error).to.be.an.instanceof(PasswordNotMatching);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when password is not supplied', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject, but not a PasswordNotMatching error ', async function () {
        // given
        const password = undefined;
        // eslint-disable-next-line no-sync
        const passwordHash = bcrypt.hashSync('my-real-password', 1);

        try {
          await encryptionService.checkPassword({
            password,
            passwordHash,
          });
        } catch (error) {
          expect(error).not.to.be.an.instanceof(PasswordNotMatching);
        }
      });
    });
  });
});
