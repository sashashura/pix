// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationPlacesLotSerializer = require('../../../../../../lib/infrastructure/serializers/jsonapi/organization/organization-places-lot-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { FREE_RATE } = require('../../../../../../lib/domain/constants/organization-places-categories');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | organization-places-lot-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    //given
    const jsonOrganizationPlacesSet = {
      data: {
        attributes: {
          'organization-id': 2,
          count: 10,
          'activation-date': '2022-01-02',
          'expiration-date': '2023-01-01',
          reference: 'ABC123',
          category: FREE_RATE,
          'created-by': '122',
        },
      },
    };

    const expectedJsonOrganizationPlacesSet = {
      organizationId: 2,
      count: 10,
      activationDate: '2022-01-02',
      expirationDate: '2023-01-01',
      reference: 'ABC123',
      category: FREE_RATE,
      createdBy: '122',
    };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into an organization place set object', function () {
      //when
      const organizationPlaceSet = organizationPlacesLotSerializer.deserialize(jsonOrganizationPlacesSet);

      //then
      expect(organizationPlaceSet).to.be.deep.equal(expectedJsonOrganizationPlacesSet);
    });
  });
});
