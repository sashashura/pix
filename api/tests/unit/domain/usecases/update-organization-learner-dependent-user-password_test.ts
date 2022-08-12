// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError, UserNotAuthorizedToUpdatePasswordError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateOrganizationLearnerDependentUserPassword = require('../../../../lib/domain/usecases/update-organization-learner-dependent-user-password');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-organization-learner-dependent-user-password', function () {
  const userId = 1;
  const organizationId = 1;
  const organizationLearnerId = 1;

  const generatedPassword = 'Pix12345';
  const encryptedPassword = '@Pix12345@';

  let passwordGenerator: $TSFixMe;
  let encryptionService: $TSFixMe;
  let authenticationMethodRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;
  let userRepository: $TSFixMe;

  let userMember: $TSFixMe;
  let userStudent: $TSFixMe;
  let student: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userMember = {
      id: 1,
      hasAccessToOrganization: sinon.stub().returns(true),
    };
    userStudent = {
      id: 2,
      username: 'first.last0112',
      email: 'first.last@example.net',
    };

    student = {
      id: organizationLearnerId,
      userId: userStudent.id,
      organizationId,
    };

    passwordGenerator = {
      generateSimplePassword: sinon.stub().returns(generatedPassword),
    };
    encryptionService = {
      hashPassword: sinon.stub().resolves(encryptedPassword),
    };
    authenticationMethodRepository = {
      updatePasswordThatShouldBeChanged: sinon.stub(),
    };
    organizationLearnerRepository = {
      get: sinon.stub().resolves(student),
    };
    userRepository = {
      get: sinon.stub().resolves(userStudent),
      getWithMemberships: sinon.stub().resolves(userMember),
      updatePasswordThatShouldBeChanged: sinon.stub().resolves(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get user by his id', async function () {
    // when
    await updateOrganizationLearnerDependentUserPassword({
      organizationId,
      organizationLearnerId,
      userId,
      encryptionService,
      passwordGenerator,
      authenticationMethodRepository,
      organizationLearnerRepository,
      userRepository,
    });

    // then
    expect(userRepository.getWithMemberships).to.have.been.calledWith(userId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get student by his id', async function () {
    // when
    await updateOrganizationLearnerDependentUserPassword({
      organizationId,
      organizationLearnerId,
      userId,
      encryptionService,
      passwordGenerator,
      authenticationMethodRepository,
      organizationLearnerRepository,
      userRepository,
    });

    // then
    expect(organizationLearnerRepository.get).to.have.been.calledWith(organizationLearnerId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update user password with a hashed password', async function () {
    // when
    await updateOrganizationLearnerDependentUserPassword({
      organizationId,
      organizationLearnerId,
      userId,
      encryptionService,
      passwordGenerator,
      authenticationMethodRepository,
      organizationLearnerRepository,
      userRepository,
    });

    // then
    expect(encryptionService.hashPassword).to.have.been.calledWith(generatedPassword);
    expect(authenticationMethodRepository.updatePasswordThatShouldBeChanged).to.have.been.calledWith({
      userId: userStudent.id,
      hashedPassword: encryptedPassword,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return generated password if update succeeded', async function () {
    // when
    const result = await updateOrganizationLearnerDependentUserPassword({
      organizationId,
      organizationLearnerId,
      userId,
      encryptionService,
      passwordGenerator,
      authenticationMethodRepository,
      organizationLearnerRepository,
      userRepository,
    });

    // then
    expect(result).to.equal(generatedPassword);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('When the user member is not part of student organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return UserNotAuthorizedToUpdatePasswordError', async function () {
      // given
      userMember.hasAccessToOrganization.returns(false);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateOrganizationLearnerDependentUserPassword)({
        organizationId,
        organizationLearnerId,
        userId,
        encryptionService,
        passwordGenerator,
        authenticationMethodRepository,
        organizationLearnerRepository,
        userRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToUpdatePasswordError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('When the student is not part of the organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return UserNotAuthorizedToUpdatePasswordError', async function () {
      // given
      student.organizationId = 2;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateOrganizationLearnerDependentUserPassword)({
        organizationId,
        organizationLearnerId,
        userId,
        encryptionService,
        passwordGenerator,
        authenticationMethodRepository,
        organizationLearnerRepository,
        userRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToUpdatePasswordError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("When update user student's password is not possible", function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a UserNotFoundError when user student is not found', async function () {
      // given
      userRepository.get.rejects(new UserNotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateOrganizationLearnerDependentUserPassword)({
        organizationId,
        organizationLearnerId,
        userId,
        encryptionService,
        passwordGenerator,
        authenticationMethodRepository,
        organizationLearnerRepository,
        userRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a UserNotAuthorizedToUpdatePasswordError when student authenticates without username or email', async function () {
      // given
      userStudent.username = null;
      userStudent.email = null;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateOrganizationLearnerDependentUserPassword)({
        organizationId,
        organizationLearnerId,
        userId,
        encryptionService,
        passwordGenerator,
        authenticationMethodRepository,
        organizationLearnerRepository,
        userRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToUpdatePasswordError);
    });
  });
});
