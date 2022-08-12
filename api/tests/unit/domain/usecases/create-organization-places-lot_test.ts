// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesLot = require('../../../../lib/domain/models/OrganizationPlacesLot');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createOrganizationPlacesLot = require('../../../../lib/domain/usecases/create-organization-places-lot');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationPlacesLotManagement = require('../../../../lib/domain/read-models/OrganizationPlacesLotManagement');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-organization-place-lot', function () {
  let organizationPlacesLotRepository: $TSFixMe, organizationRepository, organization;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationPlacesLotRepository = {
      create: sinon.stub(),
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create organization place lot with given data', async function () {
    organization = domainBuilder.buildOrganization();
    organizationRepository = {
      get: sinon.stub().resolves(organization),
    };

    //given
    const organizationId = organization.id;
    const createdBy = 666;
    const organizationPlacesLotData = {
      organizationId,
      createdBy,
      count: 10,
      category: OrganizationPlacesLot.categories.FREE_RATE,
      activationDate: '2022-01-02',
      expirationDate: '2023-01-01',
      reference: 'ABC123',
    };

    const organizationPlaceLotId = 12;

    const expectedOrganizationPlacesLotData = new OrganizationPlacesLot({
      ...organizationPlacesLotData,
      organizationId,
      createdBy,
    });

    const expectedOrganizatonPlacesLotManagement = new organizationPlacesLotManagement(
      expectedOrganizationPlacesLotData
    );

    organizationPlacesLotRepository.create.withArgs(expectedOrganizationPlacesLotData).resolves(organizationPlaceLotId);
    organizationRepository.get.withArgs(organizationId).resolves(organization);
    organizationPlacesLotRepository.get
      .withArgs(organizationPlaceLotId)
      .resolves(expectedOrganizatonPlacesLotManagement);

    //when
    const result = await createOrganizationPlacesLot({
      organizationPlacesLotData,
      organizationId,
      createdBy,
      organizationPlacesLotRepository,
      organizationRepository,
    });

    //then
    expect(result).to.equal(expectedOrganizatonPlacesLotManagement);
  });
});
