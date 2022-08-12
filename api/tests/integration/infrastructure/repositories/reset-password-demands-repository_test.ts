// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const resetPasswordDemandsRepository = require('../../../../lib/infrastructure/repositories/reset-password-demands-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordRe... Remove this comment to see the full error message
const { PasswordResetDemandNotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | reset-password-demands-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('reset-password-demands').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a password reset demand', async function () {
      // when
      const email = 'someMail@example.net';
      const temporaryKey = 'someKey';
      await resetPasswordDemandsRepository.create({ email, temporaryKey });

      // then
      const demand = await knex('reset-password-demands').select('email', 'temporaryKey', 'used').first();
      expect(demand.email).to.equal(email);
      expect(demand.temporaryKey).to.equal(temporaryKey);
      expect(demand.used).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#markAsBeingUsed', function () {
    const email = 'someEmail@example.net';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      databaseBuilder.factory.buildResetPasswordDemand({ email, used: false });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should mark demand as used', async function () {
      // when
      await resetPasswordDemandsRepository.markAsBeingUsed(email);

      // then
      const demand = await knex('reset-password-demands').select('used').where({ email }).first();
      expect(demand.used).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be case insensitive', async function () {
      // when
      const emailWithUppercase = email.toUpperCase();
      await resetPasswordDemandsRepository.markAsBeingUsed(emailWithUppercase);

      // then
      const demand = await knex('reset-password-demands').select('used').where({ email }).first();
      expect(demand.used).to.be.true;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when case is not identical', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should mark demand as used', async function () {
        // given
        const sameEmailWithAnotherCase = 'SomeEmaIL@example.net';

        // when
        await resetPasswordDemandsRepository.markAsBeingUsed(sameEmailWithAnotherCase);

        // then
        const demand = await knex('reset-password-demands').select('used').where({ email }).first();
        expect(demand.used).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByTemporaryKey', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when demand does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a PasswordResetDemandNotFoundError', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(resetPasswordDemandsRepository.findByTemporaryKey)('salut les noobs');

        // then
        expect(error).to.be.instanceOf(PasswordResetDemandNotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when demand exists', function () {
      const temporaryKey = 'someTemporaryKey';

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when demand has been used already', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          databaseBuilder.factory.buildResetPasswordDemand({ temporaryKey, used: true });
          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a PasswordResetDemandNotFoundError', async function () {
          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(resetPasswordDemandsRepository.findByTemporaryKey)(temporaryKey);

          // then
          expect(error).to.be.instanceOf(PasswordResetDemandNotFoundError);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when demand is still up', function () {
        const email = 'someMail@example.net';
        let demandId: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          demandId = databaseBuilder.factory.buildResetPasswordDemand({ email, temporaryKey, used: false }).id;
          databaseBuilder.factory.buildResetPasswordDemand({ email, used: false });
          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the bookshelf demand', async function () {
          // when
          const demand = await resetPasswordDemandsRepository.findByTemporaryKey(temporaryKey);

          // then
          expect(demand.attributes.id).to.equal(demandId);
          expect(demand.attributes.email).to.equal(email);
          expect(demand.attributes.temporaryKey).to.equal(temporaryKey);
          expect(demand.attributes.used).to.equal(false);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserEmail', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when demand does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a PasswordResetDemandNotFoundError', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(resetPasswordDemandsRepository.findByUserEmail)(
          'bolossdu66@example.net',
          'salut les noobs'
        );

        // then
        expect(error).to.be.instanceOf(PasswordResetDemandNotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when demand exists', function () {
      const temporaryKey = 'someTemporaryKey';
      const email = 'someMail@example.net';

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when demand has been used already', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          databaseBuilder.factory.buildResetPasswordDemand({ email, temporaryKey, used: true });
          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a PasswordResetDemandNotFoundError', async function () {
          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(resetPasswordDemandsRepository.findByUserEmail)(email, temporaryKey);

          // then
          expect(error).to.be.instanceOf(PasswordResetDemandNotFoundError);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when demand is still up', function () {
        let demandId: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          demandId = databaseBuilder.factory.buildResetPasswordDemand({ email, temporaryKey, used: false }).id;
          databaseBuilder.factory.buildResetPasswordDemand({ email, used: false });
          databaseBuilder.factory.buildResetPasswordDemand({ temporaryKey, used: false });
          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the bookshelf demand', async function () {
          // when
          const demand = await resetPasswordDemandsRepository.findByUserEmail(email, temporaryKey);

          // then
          expect(demand.attributes.id).to.equal(demandId);
          expect(demand.attributes.email).to.equal(email);
          expect(demand.attributes.temporaryKey).to.equal(temporaryKey);
          expect(demand.attributes.used).to.equal(false);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should be case insensitive', async function () {
          // when
          const emailWithUppercase = email.toUpperCase();
          const demand = await resetPasswordDemandsRepository.findByUserEmail(emailWithUppercase, temporaryKey);

          // then
          expect(demand.attributes.id).to.equal(demandId);
          expect(demand.attributes.email).to.equal(email);
          expect(demand.attributes.temporaryKey).to.equal(temporaryKey);
          expect(demand.attributes.used).to.equal(false);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when case is not identical', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the bookshelf demand', async function () {
            // given
            const sameEmailWithAnotherCase = 'SomeMaIL@example.net';

            // when
            const demand = await resetPasswordDemandsRepository.findByUserEmail(sameEmailWithAnotherCase, temporaryKey);

            // then
            expect(demand.attributes.id).to.equal(demandId);
            expect(demand.attributes.email).to.equal(email);
            expect(demand.attributes.temporaryKey).to.equal(temporaryKey);
            expect(demand.attributes.used).to.equal(false);
          });
        });
      });
    });
  });
});
