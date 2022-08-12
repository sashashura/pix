// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError, UserNotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCert... Remove this comment to see the full error message
const createCertificationCenterMembershipByEmail = require('../../../../lib/domain/usecases/create-certification-center-membership-by-email');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-certification-center-membership-by-email', function () {
  const certificationCenterId = 1;
  const email = 'user@exemple.net';
  const userId = 1;

  let certificationCenterMembershipRepository: $TSFixMe;
  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCenterMembershipRepository = {
      isMemberOfCertificationCenter: sinon.stub(),
      save: sinon.stub(),
    };
    userRepository = {
      getByEmail: sinon.stub(),
    };

    certificationCenterMembershipRepository.isMemberOfCertificationCenter.resolves(false);
    certificationCenterMembershipRepository.save.resolves();
    userRepository.getByEmail.resolves({ id: userId });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repositories', async function () {
    // when
    await createCertificationCenterMembershipByEmail({
      certificationCenterId,
      email,
      certificationCenterMembershipRepository,
      userRepository,
    });

    // then
    expect(userRepository.getByEmail).has.been.calledWith(email);
    expect(certificationCenterMembershipRepository.isMemberOfCertificationCenter).has.been.calledWith({
      userId,
      certificationCenterId,
    });
    expect(certificationCenterMembershipRepository.save).has.been.calledWith({ userId, certificationCenterId });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw UserNotFoundError if no user matches this email', async function () {
    // given
    userRepository.getByEmail.throws(new UserNotFoundError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createCertificationCenterMembershipByEmail)({
      certificationCenterId,
      email,
      certificationCenterMembershipRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotFoundError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw AlreadyExistingEntityError if certification center membership exist', async function () {
    // given
    certificationCenterMembershipRepository.isMemberOfCertificationCenter.resolves(true);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createCertificationCenterMembershipByEmail)({
      certificationCenterId,
      email,
      certificationCenterMembershipRepository,
      userRepository,
    });

    // then
    expect(error).to.be.instanceOf(AlreadyExistingEntityError);
    expect((error as $TSFixMe).message).to.equal(`Certification center membership already exists for the user ID ${userId} and certification center ID ${certificationCenterId}.`);
  });
});
