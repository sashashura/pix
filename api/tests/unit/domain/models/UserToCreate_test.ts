// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserToCrea... Remove this comment to see the full error message
const UserToCreate = require('../../../../lib/domain/models/UserToCreate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | UserToCreate', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a default user', function () {
      // given / when
      const user = new UserToCreate();

      // then
      expect(user).to.deep.equal({
        firstName: '',
        lastName: '',
        email: null,
        cgu: false,
        hasSeenAssessmentInstructions: false,
        username: null,
        mustValidateTermsOfService: false,
        lastTermsOfServiceValidatedAt: null,
        lang: 'fr',
        hasSeenNewDashboardInfo: false,
        isAnonymous: false,
        hasSeenFocusedChallengeTooltip: false,
        hasSeenOtherChallengesTooltip: false,
        createdAt: undefined,
        updatedAt: undefined,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a user', function () {
      // given
      const now = new Date('2022-04-01');
      const clock = sinon.useFakeTimers({ now });

      // when
      const user = UserToCreate.create({ email: '  anneMAIL@example.net ' });

      // then
      expect(user.email).to.equal('annemail@example.net');
      expect(user.updatedAt).to.deep.equal(now);
      expect(user.createdAt).to.deep.equal(now);
      clock.restore();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createWithTermsOfServiceAccepted', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a user from pole emploi', function () {
      // given
      const now = new Date('2022-04-01');
      const clock = sinon.useFakeTimers({ now });

      // when
      const user = UserToCreate.createWithTermsOfServiceAccepted({ email: '  anneMAIL@example.net ' });

      // then
      expect(user.cgu).to.equal(true);
      expect(user.lastTermsOfServiceValidatedAt).to.deep.equal(now);
      expect(user.updatedAt).to.deep.equal(now);
      expect(user.createdAt).to.deep.equal(now);
      clock.restore();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAnonymous', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create an anonymous user', function () {
      // given
      const now = new Date('2022-04-01');
      const clock = sinon.useFakeTimers({ now });

      // when
      const user = UserToCreate.createAnonymous({ email: '  anneMAIL@example.net ' });

      // then
      expect(user.isAnonymous).to.equal(true);
      expect(user.updatedAt).to.deep.equal(now);
      expect(user.createdAt).to.deep.equal(now);
      clock.restore();
    });
  });
});
