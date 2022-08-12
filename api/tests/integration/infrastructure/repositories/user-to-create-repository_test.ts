// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
const { AlreadyRegisteredUsernameError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const UserToCreateRepository = require('../../../../lib/infrastructure/repositories/user-to-create-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserToCrea... Remove this comment to see the full error message
const UserToCreate = require('../../../../lib/domain/models/UserToCreate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | UserToCreateRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('users').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the user', async function () {
      // given
      const email = 'my-email-to-save@example.net';
      const user = new UserToCreate({
        firstName: 'laura',
        lastName: 'lune',
        email,
        cgu: true,
      });

      // when
      await UserToCreateRepository.create({ user });

      // then
      const usersSaved = await knex('users').select();
      expect(usersSaved).to.have.lengthOf(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a Domain User object', async function () {
      // given
      const email = 'my-email-to-save@example.net';
      const user = new UserToCreate({
        firstName: 'laura',
        lastName: 'lune',
        email,
        cgu: true,
      });

      // when
      const userSaved = await UserToCreateRepository.create({ user });

      // then
      expect(userSaved).to.be.an.instanceOf(User);
      expect(userSaved.firstName).to.equal(user.firstName);
      expect(userSaved.lastName).to.equal(user.lastName);
      expect(userSaved.email).to.equal(user.email);
      expect(userSaved.cgu).to.equal(user.cgu);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a custom error when username is already taken', async function () {
      // given
      const alreadyExistingUserName = 'thierryDicule1234';
      databaseBuilder.factory.buildUser({ id: 7, username: alreadyExistingUserName });
      await databaseBuilder.commit();

      const now = new Date('2022-02-01');
      const user = new UserToCreate({
        firstName: 'Thierry',
        lastName: 'Dicule',
        username: alreadyExistingUserName,
        createdAt: now,
        updatedAt: now,
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(UserToCreateRepository.create)({ user });

      // then
      expect(error).to.be.instanceOf(AlreadyRegisteredUsernameError);
    });
  });
});
