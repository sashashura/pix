// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'accountRec... Remove this comment to see the full error message
const accountRecoveryDemandRepository = require('../../../../lib/infrastructure/repositories/account-recovery-demand-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
const AccountRecoveryDemand = require('../../../../lib/domain/models/AccountRecoveryDemand');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | account-recovery-demand-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('account-recovery-demands').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByTemporaryKey', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when demand does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a not found error', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(accountRecoveryDemandRepository.findByTemporaryKey)('temporary key not found');

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.be.equal('No account recovery demand found');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when demand exists', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when demand has been used already', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the account recovery demand', async function () {
          // given
          const email = 'someMail@example.net';
          const temporaryKey = 'someTemporaryKey';
          const {
            id: demandId,
            userId,
            organizationLearnerId,
            createdAt,
          } = await databaseBuilder.factory.buildAccountRecoveryDemand({ email, temporaryKey, used: true });
          await databaseBuilder.factory.buildAccountRecoveryDemand({ email, used: false });
          await databaseBuilder.commit();
          const expectedAccountRecoveryDemand = {
            id: demandId,
            userId,
            oldEmail: null,
            organizationLearnerId,
            newEmail: 'philipe@example.net',
            temporaryKey: 'someTemporaryKey',
            used: true,
            createdAt,
          };
          // when
          const demand = await accountRecoveryDemandRepository.findByTemporaryKey(temporaryKey);

          // then
          expect(demand).to.deep.equal(expectedAccountRecoveryDemand);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when demand is not used yet', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the account recovery demand when demand is still valid', async function () {
          // given
          const email = 'someMail@example.net';
          const temporaryKey = 'someTemporaryKey';
          const {
            id: demandId,
            userId,
            organizationLearnerId,
            createdAt,
          } = await databaseBuilder.factory.buildAccountRecoveryDemand({ email, temporaryKey, used: false });
          await databaseBuilder.factory.buildAccountRecoveryDemand({ email, used: false });
          await databaseBuilder.commit();
          const expectedAccountRecoveryDemand = {
            id: demandId,
            userId,
            oldEmail: null,
            organizationLearnerId,
            newEmail: 'philipe@example.net',
            temporaryKey: 'someTemporaryKey',
            used: false,
            createdAt,
          };
          // when
          const demand = await accountRecoveryDemandRepository.findByTemporaryKey(temporaryKey);

          // then
          expect(demand).to.deep.equal(expectedAccountRecoveryDemand);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no demand', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        //given
        const userId = 1;

        // when
        const result = await accountRecoveryDemandRepository.findByUserId(userId);

        // then
        expect(result).to.be.an('array').that.is.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are several demands for several users', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only the user ones', async function () {
        // given
        databaseBuilder.factory.buildAccountRecoveryDemand();
        const expectedUser = databaseBuilder.factory.buildUser();
        const firstAccountRecoveryDemand = databaseBuilder.factory.buildAccountRecoveryDemand({
          userId: expectedUser.id,
          temporaryKey: 'temporaryKey1',
          oldEmail: null,
        });
        const secondAccountRecoveryDemand = databaseBuilder.factory.buildAccountRecoveryDemand({
          userId: expectedUser.id,
          used: true,
          temporaryKey: 'temporaryKey2',
          oldEmail: null,
        });

        await databaseBuilder.commit();

        // when
        const result = await accountRecoveryDemandRepository.findByUserId(expectedUser.id);

        // then
        expect(result).to.be.deep.equal([
          omit(firstAccountRecoveryDemand, 'updatedAt'),
          omit(secondAccountRecoveryDemand, 'updatedAt'),
        ]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#markAsBeingUsed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should mark demand as used', async function () {
      // given
      const temporaryKey = 'temporaryKey';
      databaseBuilder.factory.buildAccountRecoveryDemand({ temporaryKey, used: false });
      await databaseBuilder.commit();

      // when
      await accountRecoveryDemandRepository.markAsBeingUsed(temporaryKey);

      // then
      const demand = await knex('account-recovery-demands').select('used').where({ temporaryKey }).first();
      expect(demand.used).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should change updatedAt', async function () {
      // given
      const temporaryKey = 'temporaryKey';
      const oldUpdatedAt = new Date('2013-01-01T15:00:00Z');
      databaseBuilder.factory.buildAccountRecoveryDemand({ temporaryKey, used: false, updatedAt: oldUpdatedAt });
      await databaseBuilder.commit();

      // when
      await accountRecoveryDemandRepository.markAsBeingUsed(temporaryKey);

      // then
      const demand = await knex('account-recovery-demands').where({ temporaryKey }).first();
      const newUpdatedAt = demand.updatedAt;
      expect(newUpdatedAt).to.be.above(oldUpdatedAt);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should rollback update if error occurs in transaction', async function () {
      // given
      const temporaryKey = 'temporaryKey';
      databaseBuilder.factory.buildAccountRecoveryDemand({ temporaryKey, used: false });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async () => {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await accountRecoveryDemandRepository.markAsBeingUsed(temporaryKey, domainTransaction);
          throw new Error('Error occurs in transaction');
        });
      });

      // then
      const demand = await knex('account-recovery-demands').select('used').where({ temporaryKey }).first();
      expect(demand.used).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should persist the account recovery demand', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId: user.id }).id;
      await databaseBuilder.commit();

      const userId = user.id;
      const newEmail = 'dupont@example.net';
      const oldEmail = 'eleve-dupont@example.net';
      const used = false;
      const temporaryKey = '123456789AZERTYUIO';
      const accountRecoveryDemandAttributes = {
        userId,
        organizationLearnerId,
        newEmail,
        oldEmail,
        used,
        temporaryKey,
      };
      const accountRecoveryDemand = domainBuilder.buildAccountRecoveryDemand(accountRecoveryDemandAttributes);

      // when
      const result = await accountRecoveryDemandRepository.save(accountRecoveryDemand);

      // then
      const accountRecoveryDemands = await knex('account-recovery-demands').select();
      expect(accountRecoveryDemands).to.have.length(1);
      expect(result).to.be.instanceOf(AccountRecoveryDemand);
      expect(result.userId).to.equal(userId);
      expect(result.newEmail).to.equal(newEmail);
      expect(result.used).to.equal(used);
      expect(result.temporaryKey).to.equal(temporaryKey);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if no row is saved', async function () {
      // given
      const notValidAccountRecoveryDemand = 123;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(accountRecoveryDemandRepository.save)(notValidAccountRecoveryDemand);

      // then
      expect(error).to.be.instanceOf(Error);
    });
  });
});
