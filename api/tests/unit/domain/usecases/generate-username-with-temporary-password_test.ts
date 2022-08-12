// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToGenerateUsernamePasswordError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const generateUsernameWithTemporaryPassword = require('../../../../lib/domain/usecases/generate-username-with-temporary-password.js');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | generate-username-with-temporary-password', function () {
  const expectedUsername = 'john.harry0207';
  const expectedPassword = 'Pix12345';
  const hashedPassword = 'ABC';

  let userRelatedToStudent: $TSFixMe;
  let organizationId: $TSFixMe;

  let organizationLearner: $TSFixMe;
  let organizationLearnerId: $TSFixMe;

  let passwordGenerator: $TSFixMe;
  let encryptionService: $TSFixMe;
  let userReconciliationService: $TSFixMe;
  let userService: $TSFixMe;

  let authenticationMethodRepository: $TSFixMe;
  let userRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRelatedToStudent = domainBuilder.buildUser({
      username: null,
    });
    const organization = userRelatedToStudent.memberships[0].organization;
    organizationId = userRelatedToStudent.memberships[0].organization.id;

    organizationLearner = domainBuilder.buildOrganizationLearner({
      organization,
    });
    organizationLearnerId = organizationLearner.id;

    passwordGenerator = {
      generateSimplePassword: sinon.stub().returns(expectedPassword),
    };
    encryptionService = {
      hashPassword: sinon.stub().resolves(hashedPassword),
    };
    userReconciliationService = {
      createUsernameByUser: sinon.stub().resolves(expectedUsername),
    };
    userService = {
      updateUsernameAndAddPassword: sinon.stub(),
    };
    authenticationMethodRepository = {
      hasIdentityProviderPIX: sinon.stub().resolves(),
      updatePasswordThatShouldBeChanged: sinon.stub().resolves(),
    };
    userRepository = {
      addUsername: sinon.stub(),
      get: sinon.stub().resolves(userRelatedToStudent),
      updateUsernameAndPassword: sinon.stub().resolves(),
    };
    organizationLearnerRepository = {
      get: sinon.stub(),
    };
    organizationLearnerRepository.get.withArgs(organizationLearnerId).resolves(organizationLearner);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should generate username and temporary password', async function () {
    // when
    const result = await generateUsernameWithTemporaryPassword({
      organizationLearnerId,
      organizationId,
      passwordGenerator,
      encryptionService,
      userReconciliationService,
      userService,
      authenticationMethodRepository,
      userRepository,
      organizationLearnerRepository,
    });

    // then
    expect(result.username).to.be.equal(expectedUsername);
    expect(result.generatedPassword).to.be.equal(expectedPassword);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error when student has not access to the organization', async function () {
    // given
    organizationLearner.organizationId = 99;

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(generateUsernameWithTemporaryPassword)({
      organizationLearnerId,
      organizationId,
      passwordGenerator,
      encryptionService,
      userReconciliationService,
      userService,
      authenticationMethodRepository,
      userRepository,
      organizationLearnerRepository,
    });

    // then
    expect(error).to.be.instanceof(UserNotAuthorizedToGenerateUsernamePasswordError);
    expect((error as $TSFixMe).message).to.be.equal(`L'élève avec l'INE ${organizationLearner.nationalStudentId} n'appartient pas à l'organisation.`);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error when student account has already a username', async function () {
    // given
    userRelatedToStudent.username = 'username';
    userRepository.get.resolves(userRelatedToStudent);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(generateUsernameWithTemporaryPassword)({
      organizationLearnerId,
      organizationId,
      passwordGenerator,
      encryptionService,
      userReconciliationService,
      userService,
      authenticationMethodRepository,
      userRepository,
      organizationLearnerRepository,
    });

    // then
    expect(error).to.be.instanceof(UserNotAuthorizedToGenerateUsernamePasswordError);
    expect((error as $TSFixMe).message).to.be.equal(`Ce compte utilisateur dispose déjà d'un identifiant: ${userRelatedToStudent.username}.`);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when organization-learner refers to an user with a password', function () {
    const username = 'john.doe2510';
    const userEmail = 'john.doe@example.net';

    let userWithEmail;
    let organization;
    let organizationId: $TSFixMe;
    let organizationLearner: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userWithEmail = domainBuilder.buildUser({
        email: userEmail,
        username: null,
      });
      organization = userWithEmail.memberships[0].organization;
      organizationId = userWithEmail.memberships[0].organization.id;

      organizationLearner = domainBuilder.buildOrganizationLearner({
        organization,
      });

      userReconciliationService.createUsernameByUser.resolves(username);

      organizationLearnerRepository.get.withArgs(organizationLearner.id).resolves(organizationLearner);
      userRepository.get.resolves(userWithEmail);
      userRepository.addUsername.resolves({ ...userWithEmail, username });

      authenticationMethodRepository.hasIdentityProviderPIX.resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an username', async function () {
      // when
      const result = await generateUsernameWithTemporaryPassword({
        organizationLearnerId: organizationLearner.id,
        organizationId,
        passwordGenerator,
        encryptionService,
        userReconciliationService,
        userService,
        authenticationMethodRepository,
        userRepository,
        organizationLearnerRepository,
      });

      // then
      expect(result.username).to.be.equal(username);
    });
  });
});
