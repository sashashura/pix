// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getAvailableTargetProfilesForOrganization = require('../../../../lib/domain/usecases/get-available-target-profiles-for-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-available-target-profiles-for-organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns the target profile available for the given organizations', async function () {
    const organizationId = 12;
    const expectedTargetProfiles = Symbol('TargetProfileForSpecifier');
    const TargetProfileForSpecifierRepository = { availableForOrganization: sinon.stub() };

    TargetProfileForSpecifierRepository.availableForOrganization
      .withArgs(organizationId)
      .resolves(expectedTargetProfiles);

    const targetProfiles = await getAvailableTargetProfilesForOrganization({
      organizationId,
      TargetProfileForSpecifierRepository,
    });

    expect(targetProfiles).to.equal(expectedTargetProfiles);
  });
});
