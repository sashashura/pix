// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createOrUpdateUserOrgaSettings = require('../../../../lib/domain/usecases/create-or-update-user-orga-settings');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotMem... Remove this comment to see the full error message
const { UserNotMemberOfOrganizationError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userOrgaSe... Remove this comment to see the full error message
const userOrgaSettingsRepository = require('../../../../lib/infrastructure/repositories/user-orga-settings-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-or-update-user-orga-settings', function () {
  const userId = 1;
  const organizationId = 3;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    membershipRepository.findByUserIdAndOrganizationId = sinon.stub();
    sinon.stub(userOrgaSettingsRepository, 'createOrUpdate');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create or update the user orga settings if user is a member of the organization', async function () {
    // given
    membershipRepository.findByUserIdAndOrganizationId.withArgs({ userId, organizationId }).resolves([{}]);

    // when
    await createOrUpdateUserOrgaSettings({ userId, organizationId, userOrgaSettingsRepository, membershipRepository });

    // then
    expect(userOrgaSettingsRepository.createOrUpdate).to.have.been.calledWithExactly({ userId, organizationId });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a UserNotMemberOfOrganizationError if user is not member of the organization', async function () {
    // given
    membershipRepository.findByUserIdAndOrganizationId.withArgs({ userId, organizationId }).resolves([]);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createOrUpdateUserOrgaSettings)({
      userId,
      organizationId,
      userOrgaSettingsRepository,
      membershipRepository,
    });

    // then
    expect(error).to.be.an.instanceof(UserNotMemberOfOrganizationError);
    expect((error as $TSFixMe).message).to.equal(`L'utilisateur ${userId} n'est pas membre de l'organisation ${organizationId}.`);
  });
});
