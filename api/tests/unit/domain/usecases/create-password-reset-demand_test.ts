// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createPass... Remove this comment to see the full error message
const { createPasswordResetDemand } = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-password-reset-demand', function () {
  const email = 'user@example.net';
  const locale = 'fr';
  const temporaryKey = 'ABCDEF123';

  const resetPasswordDemand = {
    attributes: {
      id: 1,
      email,
      temporaryKey,
    },
  };

  let mailService: $TSFixMe;
  let resetPasswordService: $TSFixMe;
  let resetPasswordDemandRepository: $TSFixMe;
  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    mailService = {
      sendResetPasswordDemandEmail: sinon.stub(),
    };
    resetPasswordService = {
      generateTemporaryKey: sinon.stub(),
    };
    resetPasswordDemandRepository = {
      create: sinon.stub(),
    };
    userRepository = {
      isUserExistingByEmail: sinon.stub(),
    };

    userRepository.isUserExistingByEmail.resolves({ id: 1 });
    resetPasswordService.generateTemporaryKey.returns(temporaryKey);
    resetPasswordDemandRepository.create.resolves(resetPasswordDemand);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create a password reset demand if user email exists', async function () {
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
    expect(result).to.deep.equal(resetPasswordDemand);

    expect(userRepository.isUserExistingByEmail).to.have.been.calledWithExactly(email);
    expect(resetPasswordService.generateTemporaryKey).to.have.been.calledOnce;
    expect(resetPasswordDemandRepository.create).to.have.been.calledWithExactly({ email, temporaryKey });
    expect(mailService.sendResetPasswordDemandEmail).to.have.been.calledWithExactly({ email, locale, temporaryKey });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw UserNotFoundError if user email does not exist', async function () {
    // given
    userRepository.isUserExistingByEmail.throws(new UserNotFoundError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createPasswordResetDemand)({
      email,
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
