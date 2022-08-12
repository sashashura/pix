// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, databaseBuilder, expect, knex } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../../../../lib/infrastructure/repositories/authentication-method-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'accountRec... Remove this comment to see the full error message
const accountRecoveryDemandRepository = require('../../../../../lib/infrastructure/repositories/account-recovery-demand-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encryption... Remove this comment to see the full error message
const encryptionService = require('../../../../../lib/domain/services/encryption-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateUser... Remove this comment to see the full error message
const updateUserForAccountRecovery = require('../../../../../lib/domain/usecases/account-recovery/update-user-for-account-recovery');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | Account-recovery | updateUserForAccountRecovery', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should rollback update user account when domain transaction throw an error', async function () {
    // given
    const password = 'pix123';
    const user = databaseBuilder.factory.buildUser();
    await databaseBuilder.commit();
    const authenticatedMethod =
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId: user.id,
      });
    await databaseBuilder.commit();
    const accountRecovery = databaseBuilder.factory.buildAccountRecoveryDemand({ userId: user.id });
    await databaseBuilder.commit();

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    await catchErr(async () => {
      await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        await updateUserForAccountRecovery({
          password,
          temporaryKey: accountRecovery.temporaryKey,
          userRepository,
          authenticationMethodRepository,
          accountRecoveryDemandRepository,
          encryptionService,
          domainTransaction,
        });
        throw new Error('an error occurs within the domain transaction');
      });
    });

    // then
    const userUpdated = await knex('users');
    const accountRecoveryDemand = await knex('account-recovery-demands');
    const authenticationMethod = await knex('authentication-methods');

    expect(userUpdated).to.have.lengthOf(1);
    expect(accountRecoveryDemand).to.have.lengthOf(1);
    expect(authenticationMethod).to.have.lengthOf(1);

    expect(userUpdated[0].email).to.equal(user.email);
    expect(userUpdated[0].emailConfirmedAt).to.be.null;
    expect(userUpdated[0].cgu).to.be.equal(user.cgu);
    expect(accountRecoveryDemand[0].used).to.be.false;
    expect(authenticationMethod[0].password).to.equal(authenticatedMethod.password);
  });
});
