// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findOrganizationPlaceLot = require('../../../../lib/domain/usecases/find-organization-places-lot');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | find-organization-places', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get the organization places', async function () {
    // given
    const organizationId = Symbol('organizationId');
    const expectedOrganizationPlaces = Symbol('OrganizationPlaces');
    const organizationPlacesLotRepository = {
      findByOrganizationId: sinon.stub(),
    };
    organizationPlacesLotRepository.findByOrganizationId.withArgs(organizationId).resolves(expectedOrganizationPlaces);

    // when
    const organizationPlace = await findOrganizationPlaceLot({
      organizationId,
      organizationPlacesLotRepository,
    });

    // then
    expect(organizationPlace).to.equal(expectedOrganizationPlaces);
  });
});
