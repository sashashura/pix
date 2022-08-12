// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, databaseBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
const { AlreadyRegisteredEmailError, AlreadyRegisteredUsernameError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
const UserDetailsForAdmin = require('../../../../lib/domain/models/UserDetailsForAdmin');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateUser... Remove this comment to see the full error message
const updateUserDetailsForAdministration = require('../../../../lib/domain/usecases/update-user-details-for-administration');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | updateUserDetailsForAdministration', function () {
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser({ email: 'email@example.net' }).id;
    databaseBuilder.factory.buildUser({ email: 'alreadyexist@example.net' });
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update user email, firstname and lastname', async function () {
    // given
    const userToUpdate = {
      email: 'partial@example.net',
      firstName: 'firstName',
      lastName: 'lastName',
    };

    // when
    const result = await updateUserDetailsForAdministration({
      userId,
      userDetailsForAdministration: userToUpdate,
      userRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(UserDetailsForAdmin);
    expect(result.email).equal(userToUpdate.email);
    expect(result.firstName).equal(userToUpdate.firstName);
    expect(result.lastName).equal(userToUpdate.lastName);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update user email only', async function () {
    // given
    const userToUpdate = {
      email: 'partial@example.net',
    };

    // when
    const result = await updateUserDetailsForAdministration({
      userId,
      userDetailsForAdministration: userToUpdate,
      userRepository,
    });

    // then
    expect(result.email).equal(userToUpdate.email);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update user and return it with its organization learners', async function () {
    // given
    let organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO' }).id;
    databaseBuilder.factory.buildOrganizationLearner({ id: 1, userId, organizationId });
    organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO' }).id;
    databaseBuilder.factory.buildOrganizationLearner({ id: 2, userId, organizationId });
    await databaseBuilder.commit();
    const userDetailsForAdministration = { email: 'partial@example.net' };

    // when
    const result = await updateUserDetailsForAdministration({
      userId,
      userDetailsForAdministration,
      userRepository,
    });

    // then
    expect(result.organizationLearners.length).to.equal(2);
    expect(result.email).to.equal(userDetailsForAdministration.email);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw AlreadyRegisteredEmailError when email is already used by another user', async function () {
    // given
    const userToUpdate = {
      email: 'alreadyEXIST@example.net',
    };

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateUserDetailsForAdministration)({
      userId,
      userDetailsForAdministration: userToUpdate,
      userRepository,
    });

    // then
    expect(error).to.be.instanceOf(AlreadyRegisteredEmailError);
    expect((error as $TSFixMe).message).to.equal('Cette adresse e-mail est déjà utilisée.');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw AlreadyRegisteredUsernameError when username is already used', async function () {
    // given
    const userToUpdate = databaseBuilder.factory.buildUser({
      email: null,
      username: 'current.username',
    });

    const anotherUser = databaseBuilder.factory.buildUser({
      email: null,
      username: 'already.exist.username',
    });
    await databaseBuilder.commit();

    const expectedErrorMessage = 'Cet identifiant est déjà utilisé.';

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateUserDetailsForAdministration)({
      userId: userToUpdate.id,
      userDetailsForAdministration: { username: anotherUser.username },
      userRepository,
    });

    // then
    expect(error).to.be.instanceOf(AlreadyRegisteredUsernameError);
    expect((error as $TSFixMe).message).to.equal(expectedErrorMessage);
  });
});
