// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getPrescri... Remove this comment to see the full error message
const getPrescriber = require('../../../../lib/domain/usecases/get-prescriber');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotMem... Remove this comment to see the full error message
const { UserNotMemberOfOrganizationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-prescriber', function () {
  const userId = 1;
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const expectedResult = Symbol('prescriber');
  let prescriberRepository: $TSFixMe;
  let membershipRepository: $TSFixMe;
  let userOrgaSettingsRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    prescriberRepository = { getPrescriber: sinon.stub() };
    membershipRepository = { findByUserId: sinon.stub() };
    userOrgaSettingsRepository = { findOneByUserId: sinon.stub(), create: sinon.stub(), update: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is not a member of any organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotMemberOfOrganizationError', async function () {
      // given
      membershipRepository.findByUserId.withArgs({ userId }).resolves([]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getPrescriber)({
        userId,
        prescriberRepository,
        membershipRepository,
        userOrgaSettingsRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotMemberOfOrganizationError);
      expect((error as $TSFixMe).message).to.equal('L’utilisateur 1 n’est membre d’aucune organisation.');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user does not have userOrgaSettings yet', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create userOrgaSettings', async function () {
      // given
      const user = domainBuilder.buildUser({ id: userId });
      const membership1 = domainBuilder.buildMembership({ user });
      const membership2 = domainBuilder.buildMembership({ user });
      membershipRepository.findByUserId.withArgs({ userId }).resolves([membership1, membership2]);
      userOrgaSettingsRepository.findOneByUserId.withArgs(userId).resolves(null);

      // when
      await getPrescriber({
        userId,
        prescriberRepository,
        membershipRepository,
        userOrgaSettingsRepository,
      });

      // then
      expect(userOrgaSettingsRepository.create).to.have.been.calledWithExactly(userId, membership1.organization.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return prescriber', async function () {
      // given
      const user = domainBuilder.buildUser({ id: userId });
      const membership = domainBuilder.buildMembership({ user });
      membershipRepository.findByUserId.withArgs({ userId }).resolves([membership]);
      userOrgaSettingsRepository.findOneByUserId.withArgs(userId).resolves(null);
      prescriberRepository.getPrescriber.withArgs(userId).resolves(expectedResult);

      // when
      const result = await getPrescriber({
        userId,
        prescriberRepository,
        membershipRepository,
        userOrgaSettingsRepository,
      });

      // then
      expect(result).to.deep.equal(expectedResult);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user already has userOrgaSettings', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not create userOrgaSettings', async function () {
      // given
      const user = domainBuilder.buildUser({ id: userId });
      const membership = domainBuilder.buildMembership({ user });
      membershipRepository.findByUserId.withArgs({ userId }).resolves([membership]);
      const userOrgaSettings = domainBuilder.buildUserOrgaSettings({
        currentOrganization: membership.organisation,
        user: membership.user,
      });
      userOrgaSettingsRepository.findOneByUserId.withArgs(userId).resolves(userOrgaSettings);

      // when
      await getPrescriber({
        userId,
        prescriberRepository,
        membershipRepository,
        userOrgaSettingsRepository,
      });

      // then
      expect(userOrgaSettingsRepository.create).to.not.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return prescriber', async function () {
      // given
      const user = domainBuilder.buildUser({ id: userId });
      const membership = domainBuilder.buildMembership({ user });
      membershipRepository.findByUserId.withArgs({ userId }).resolves([membership]);
      const userOrgaSettings = domainBuilder.buildUserOrgaSettings({
        currentOrganization: membership.organisation,
        user: membership.user,
      });
      userOrgaSettingsRepository.findOneByUserId.withArgs(userId).resolves(userOrgaSettings);
      prescriberRepository.getPrescriber.withArgs(userId).resolves(expectedResult);

      // when
      const result = await getPrescriber({
        userId,
        prescriberRepository,
        membershipRepository,
        userOrgaSettingsRepository,
      });

      // then
      expect(result).to.deep.equal(expectedResult);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("When userOrgaSettings doest not belongs to user's memberships anymore", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not update userOrgaSettings', async function () {
        // given
        const user = domainBuilder.buildUser({ id: userId });
        const membership1 = domainBuilder.buildMembership({ user });
        const membership2 = domainBuilder.buildMembership({ user });
        membershipRepository.findByUserId.withArgs({ userId }).resolves([membership1, membership2]);
        const outdatedOrganization = domainBuilder.buildOrganization();
        const userOrgaSettings = domainBuilder.buildUserOrgaSettings({
          currentOrganization: outdatedOrganization,
          user,
        });
        userOrgaSettingsRepository.findOneByUserId.withArgs(userId).resolves(userOrgaSettings);

        // when
        await getPrescriber({
          userId,
          prescriberRepository,
          membershipRepository,
          userOrgaSettingsRepository,
        });

        // then
        expect(userOrgaSettingsRepository.update).to.have.been.calledWithExactly(userId, membership1.organization.id);
      });
    });
  });
});
