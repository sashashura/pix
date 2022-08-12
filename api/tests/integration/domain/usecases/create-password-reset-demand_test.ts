// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, databaseBuilder, expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailServic... Remove this comment to see the full error message
const mailService = require('../../../../lib/domain/services/mail-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetPassw... Remove this comment to see the full error message
const resetPasswordService = require('../../../../lib/domain/services/reset-password-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetPassw... Remove this comment to see the full error message
const resetPasswordDemandRepository = require('../../../../lib/infrastructure/repositories/reset-password-demands-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createPass... Remove this comment to see the full error message
const createPasswordResetDemand = require('../../../../lib/domain/usecases/create-password-reset-demand');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-password-reset-demand', function () {
  const email = 'user@example.net';
  const locale = 'fr';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const userId = databaseBuilder.factory.buildUser({ email }).id;
    databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({ userId });
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return a password reset demand', async function () {
    // when
    const result = await createPasswordResetDemand({
      email,
      locale,
      mailService,
      resetPasswordService,
      resetPasswordDemandRepository,
      userRepository,
    });

    // then
    expect(result.attributes.email).to.deep.equal(email);
    expect(result.attributes.temporaryKey).to.be.ok;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw UserNotFoundError if no user account exists with this email', async function () {
    // given
    const unknownEmail = 'unknown@example.net';

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createPasswordResetDemand)({
      email: unknownEmail,
      locale,
      mailService,
      resetPasswordService,
      resetPasswordDemandRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotFoundError);
  });
});
