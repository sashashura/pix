// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getOrganizationDetails = require('../../../../lib/domain/usecases/get-organization-details');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-organization-details', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the Organization matching the given organization ID', async function () {
    // given
    const organizationId = 1234;
    const foundOrganization = domainBuilder.buildOrganization({
      id: organizationId,
      email: 'sco.generic.account@example.net',
    });
    const organizationForAdminRepository = {
      get: sinon.stub().resolves(foundOrganization),
    };

    // when
    const organization = await getOrganizationDetails({ organizationId, organizationForAdminRepository });

    // then
    expect(organizationForAdminRepository.get).to.have.been.calledWith(organizationId);
    expect(organization).to.be.an.instanceOf(Organization);
    expect(organization).to.deep.equal(foundOrganization);
  });
});
