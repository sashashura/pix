// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createUser... Remove this comment to see the full error message
const { createUsers } = require('../../../scripts/create-users-accounts-for-contest');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const sinon = require('sinon');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Scripts | create-users-accounts-for-contest', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createUsers', function () {
    const now = new Date();
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      clock = sinon.useFakeTimers({
        now,
        toFake: ['Date'],
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      clock.restore();
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should insert users', async function () {
      // given
      const usersInRaw = [
        {
          firstName: 'Sandy',
          lastName: 'Kilo',
          email: 'sandy-kilo@example.net',
          password: 'pix123',
        },
        {
          firstName: 'Tom',
          lastName: 'Desavoie',
          email: 'tom.desavoie@example.net',
          password: 'pixou123',
        },
      ];

      // when
      await createUsers({ usersInRaw });

      // then
      const firstUserFound = await knex('users').where({ lastName: 'Kilo' }).first();
      expect(firstUserFound).to.contains({
        firstName: 'Sandy',
        lastName: 'Kilo',
        email: 'sandy-kilo@example.net',
        cgu: true,
        pixOrgaTermsOfServiceAccepted: false,
        pixCertifTermsOfServiceAccepted: false,
        hasSeenAssessmentInstructions: false,
        username: null,
        mustValidateTermsOfService: false,
        lastTermsOfServiceValidatedAt: null,
        lang: 'fr',
        hasSeenNewDashboardInfo: false,
        isAnonymous: false,
        emailConfirmedAt: null,
        hasSeenFocusedChallengeTooltip: false,
        lastLoggedAt: null,
        hasSeenOtherChallengesTooltip: false,
        lastPixOrgaTermsOfServiceValidatedAt: null,
        lastPixCertifTermsOfServiceValidatedAt: null,
      });
      expect(firstUserFound.createdAt).to.deep.equal(now);
      expect(firstUserFound.updatedAt).to.deep.equal(now);

      const secondUserFound = await knex('users').where({ lastName: 'Desavoie' }).first();
      expect(secondUserFound).to.contains({
        firstName: 'Tom',
        lastName: 'Desavoie',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should create users's authentication methods", async function () {
      // given
      const usersInRaw = [
        {
          firstName: 'Sandy',
          lastName: 'Kilo',
          email: 'sandy-kilo@example.net',
          password: 'pix123',
        },
        {
          firstName: 'Tom',
          lastName: 'Desavoie',
          email: 'tom.desavoie@example.net',
          password: 'pixou123',
        },
      ];

      // when
      await createUsers({ usersInRaw });

      // then
      const usersInDatabases = await knex('authentication-methods');
      expect(usersInDatabases.length).to.equal(2);

      const firstUserFound = await knex('users').where({ lastName: 'Kilo' }).first();
      const firstAuthenticationMethodFound = await knex('authentication-methods')
        .where({ userId: firstUserFound.id })
        .first();
      expect(firstAuthenticationMethodFound.identityProvider).to.equal('PIX');
      expect(firstAuthenticationMethodFound.authenticationComplement.password).to.exist;
      expect(firstAuthenticationMethodFound.authenticationComplement.shouldChangePassword).to.be.false;
      expect(firstAuthenticationMethodFound.createdAt).to.be.not.null;
      expect(firstAuthenticationMethodFound.updatedAt).to.be.not.null;

      const secondUserFound = await knex('users').where({ lastName: 'Desavoie' }).first();
      const secondAuthenticationMethodFound = await knex('authentication-methods')
        .where({ userId: secondUserFound.id })
        .first();
      expect(secondAuthenticationMethodFound.authenticationComplement.password).to.exist;
    });
  });
});
