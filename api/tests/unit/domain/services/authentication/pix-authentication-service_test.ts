// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
const { PasswordNotMatching, UserNotFoundError } = require('../../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encryption... Remove this comment to see the full error message
const encryptionService = require('../../../../../lib/domain/services/encryption-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pixAuthenticationService = require('../../../../../lib/domain/services/authentication/pix-authentication-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Services | pix-authentication-service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserByUsernameAndPassword', function () {
    const username = 'user@example.net';
    const password = 'Password123';

    let user: $TSFixMe;
    let authenticationMethod: $TSFixMe;
    let userRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      user = domainBuilder.buildUser({ username });
      authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndRawPassword({
        userId: user.id,
        rawPassword: password,
      });
      user.authenticationMethods = [authenticationMethod];

      userRepository = {
        getByUsernameOrEmailWithRolesAndPassword: sinon.stub(),
      };
      sinon.stub(encryptionService, 'checkPassword');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user exist', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userRepository.getByUsernameOrEmailWithRolesAndPassword.resolves(user);
        encryptionService.checkPassword.resolves();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the user repository', async function () {
        // when
        await pixAuthenticationService.getUserByUsernameAndPassword({
          username,
          password,
          userRepository,
        });

        // then
        expect(userRepository.getByUsernameOrEmailWithRolesAndPassword).to.has.been.calledWith(username);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the encryptionService check function', async function () {
        // given
        const expectedPasswordHash = authenticationMethod.authenticationComplement.password;

        // when
        await pixAuthenticationService.getUserByUsernameAndPassword({
          username,
          password,
          userRepository,
        });

        // then
        expect(encryptionService.checkPassword).to.has.been.calledWith({
          password,
          passwordHash: expectedPasswordHash,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user found', async function () {
        // when
        const foundUser = await pixAuthenticationService.getUserByUsernameAndPassword({
          username,
          password,
          userRepository,
        });

        // then
        expect(foundUser).to.be.an.instanceof(User);
        expect(foundUser).to.equal(user);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user credentials are not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw UserNotFoundError when username does not exist', async function () {
        // given
        userRepository.getByUsernameOrEmailWithRolesAndPassword.rejects(new UserNotFoundError());

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(pixAuthenticationService.getUserByUsernameAndPassword)({
          username,
          password,
          userRepository,
        });

        // then
        expect(error).to.be.an.instanceof(UserNotFoundError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw PasswordNotMatching when password does not match', async function () {
        // given
        userRepository.getByUsernameOrEmailWithRolesAndPassword.resolves(user);
        encryptionService.checkPassword.rejects(new PasswordNotMatching());

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(pixAuthenticationService.getUserByUsernameAndPassword)({
          username,
          password,
          userRepository,
        });

        // then
        expect(error).to.be.an.instanceof(PasswordNotMatching);
      });
    });
  });
});
