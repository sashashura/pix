// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, domainBuilder, expect, sinon } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailAndUsernameError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateUser... Remove this comment to see the full error message
const updateUserDetailsForAdministration = require('../../../../lib/domain/usecases/update-user-details-for-administration');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-user-details-for-administration', function () {
  const userId = 1;

  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = {
      findAnotherUserByEmail: sinon.stub(),
      findAnotherUserByUsername: sinon.stub(),
      getUserDetailsForAdmin: sinon.stub(),
      updateUserDetailsForAdministration: sinon.stub(),
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('search existing user with email', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should search existing users with email if not empty', async function () {
      // given
      const email = 'user@example.net';
      const userDetailsForAdministration = { email };
      const user = domainBuilder.buildUser({ email: 'another@email.net' });

      userRepository.get.resolves(user);

      // when
      await updateUserDetailsForAdministration({ userId, userDetailsForAdministration, userRepository });

      // then
      expect(userRepository.findAnotherUserByEmail).to.have.been.calledWith(userId, email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not search existing users if email is empty', async function () {
      // given
      const userDetailsForAdministration = { email: null };
      const user = domainBuilder.buildUser({ email: 'another@email.net' });

      userRepository.get.resolves(user);

      // when
      await updateUserDetailsForAdministration({ userId, userDetailsForAdministration, userRepository });

      // then
      expect(userRepository.findAnotherUserByEmail.notCalled).to.be.true;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('search existing user with username', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should search existing user with username if not empty', async function () {
      // given
      const username = 'user.name';
      const userDetailsForAdministration = { username };
      const user = domainBuilder.buildUser({ username });

      userRepository.get.resolves(user);

      // when
      await updateUserDetailsForAdministration({ userId, userDetailsForAdministration, userRepository });

      // then
      expect(userRepository.findAnotherUserByUsername).to.have.been.calledWith(userId, username);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not search existing user if username is empty', async function () {
      // given
      const userDetailsForAdministration = { username: null };
      const user = domainBuilder.buildUser();

      userRepository.get.resolves(user);

      // when
      await updateUserDetailsForAdministration({ userId, userDetailsForAdministration, userRepository });

      // then
      expect(userRepository.findAnotherUserByUsername.notCalled).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update userDetailsForAdministration data', async function () {
    // given
    const email = 'user@example.net';
    const username = 'user.name';
    const attributesToUpdate = {
      email,
      firstName: 'firstName',
      lastName: 'lastName',
      username,
    };
    const user = domainBuilder.buildUser({ username, email: 'another@email.net' });

    userRepository.findAnotherUserByEmail.withArgs(userId, email).resolves([]);
    userRepository.findAnotherUserByUsername.withArgs(userId, username).resolves([]);
    userRepository.get.resolves(user);

    // when
    await updateUserDetailsForAdministration({
      userId,
      userDetailsForAdministration: attributesToUpdate,
      userRepository,
    });

    // then
    expect(userRepository.updateUserDetailsForAdministration).to.have.been.calledWith(userId, attributesToUpdate);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when adding a new email for user', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update mustValidateTermsOfService if user has username', async function () {
      // given
      const email = 'user@example.net';
      const username = 'user.name';
      const attributesToUpdate = { email };
      const user = domainBuilder.buildUser({ username, email: null });

      userRepository.findAnotherUserByEmail.withArgs(userId, email).resolves([]);
      userRepository.findAnotherUserByUsername.withArgs(userId, username).resolves([]);
      userRepository.get.withArgs(userId).resolves(user);

      // when
      await updateUserDetailsForAdministration({
        userId,
        userDetailsForAdministration: attributesToUpdate,
        userRepository,
      });

      // then
      const expectedAttributes = { email, mustValidateTermsOfService: true };
      expect(userRepository.updateUserDetailsForAdministration).to.have.been.calledWith(userId, expectedAttributes);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not update mustValidateTermsOfService if user has email', async function () {
      // given
      const email = 'user@example.net';
      const username = 'user.name';
      const attributesToUpdate = { email };
      const user = domainBuilder.buildUser({ email, username });

      userRepository.findAnotherUserByEmail.withArgs(userId, email).resolves([]);
      userRepository.findAnotherUserByUsername.withArgs(userId, username).resolves([]);
      userRepository.get.withArgs(userId).resolves(user);

      // when
      await updateUserDetailsForAdministration({
        userId,
        userDetailsForAdministration: attributesToUpdate,
        userRepository,
      });

      // then
      const expectedAttributes = { email };
      expect(userRepository.updateUserDetailsForAdministration).to.have.been.calledWith(userId, expectedAttributes);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the updated user details for admin', async function () {
    // given
    const email = 'user@example.net';
    const username = 'user.name';
    const attributesToUpdate = {
      email,
      firstName: 'firstName',
      lastName: 'lastName',
      username,
    };
    const expectedUserDetailsForAdmin = domainBuilder.buildUserDetailsForAdmin({
      ...attributesToUpdate,
      organizationLearners: [domainBuilder.buildOrganizationLearnerForAdmin()],
    });
    const user = domainBuilder.buildUser({ username, email: 'another@email.net' });

    userRepository.findAnotherUserByEmail.withArgs(userId, email).resolves([]);
    userRepository.findAnotherUserByUsername.withArgs(userId, username).resolves([]);
    userRepository.get.resolves(user);
    userRepository.getUserDetailsForAdmin.resolves(expectedUserDetailsForAdmin);

    // when
    const updatedUserDetailsForAdmin = await updateUserDetailsForAdministration({
      userId,
      userDetailsForAdministration: attributesToUpdate,
      userRepository,
    });
    // then
    expect(updatedUserDetailsForAdmin).to.deep.equal(expectedUserDetailsForAdmin);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when email and/or username are already used', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AlreadyRegisteredEmailAndUsernameError if email and username already used', async function () {
      // given
      const email = 'user@example.net';
      const username = 'user.name';
      const userDetailsForAdministration = { email, username };

      userRepository.findAnotherUserByEmail.withArgs(userId, email).resolves([new User({ email })]);
      userRepository.findAnotherUserByUsername.withArgs(userId, username).resolves([new User({ username })]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateUserDetailsForAdministration)({
        userId,
        userDetailsForAdministration,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceof(AlreadyRegisteredEmailAndUsernameError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AlreadyRegisteredEmailError if email already used', async function () {
      // given
      const email = 'user@example.net';
      const userDetailsForAdministration = { email };

      userRepository.findAnotherUserByEmail.withArgs(userId, email).resolves([new User({ email })]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateUserDetailsForAdministration)({
        userId,
        userDetailsForAdministration,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceof(AlreadyRegisteredEmailError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AlreadyRegisteredUsernameError if username already used', async function () {
      // given
      const username = 'user.name';
      const userDetailsForAdministration = { username };

      userRepository.findAnotherUserByUsername.withArgs(userId, username).resolves([new User({ username })]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateUserDetailsForAdministration)({
        userId,
        userDetailsForAdministration,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceof(AlreadyRegisteredUsernameError);
    });
  });
});
