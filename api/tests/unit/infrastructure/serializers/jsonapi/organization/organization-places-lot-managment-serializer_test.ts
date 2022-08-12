// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationPlaceLotManagementSerializer = require('../../../../../../lib/infrastructure/serializers/jsonapi/organization/organization-places-lot-management-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesLotManagement = require('../../../../../../lib/domain/read-models/OrganizationPlacesLotManagement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationPlacesLotCategories = require('../../../../../../lib/domain/constants/organization-places-categories');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | organization-places-lot-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert an Organization model object into JSON API data', function () {
      // given
      const organizationPlaces = [
        domainBuilder.buildOrganizationPlacesLotManagement({
          id: 777,
          count: 77,
          category: organizationPlacesLotCategories.T1,
          reference: 'Independance Day',
          activationDate: new Date('1996-07-04'),
          expirationDate: new Date('2016-07-04'),
          creatorFirstName: 'Roland',
          creatorLastName: 'Emmerich',
        }),
        domainBuilder.buildOrganizationPlacesLotManagement({
          id: 666,
          count: 66,
          category: organizationPlacesLotCategories.T2,
          reference: 'Godzilla',
          activationDate: new Date('2014-05-13'),
          expirationDate: new Date('2021-07-01'),
          creatorFirstName: 'Gareth',
          creatorLastName: 'Edwards',
        }),
      ];

      const expectedJSON = {
    data: [
        {
            type: 'organization-places',
            id: organizationPlaces[0].id.toString(),
            attributes: {
                count: organizationPlaces[0].count,
                category: (OrganizationPlacesLotManagement.categories as $TSFixMe).T1,
                reference: organizationPlaces[0].reference,
                'activation-date': organizationPlaces[0].activationDate,
                'expiration-date': organizationPlaces[0].expirationDate,
                'creator-full-name': organizationPlaces[0].creatorFullName,
                status: (OrganizationPlacesLotManagement.statuses as $TSFixMe).EXPIRED,
            },
        },
        {
            type: 'organization-places',
            id: organizationPlaces[1].id.toString(),
            attributes: {
                count: organizationPlaces[1].count,
                category: (OrganizationPlacesLotManagement.categories as $TSFixMe).T2,
                reference: organizationPlaces[1].reference,
                'activation-date': organizationPlaces[1].activationDate,
                'expiration-date': organizationPlaces[1].expirationDate,
                'creator-full-name': organizationPlaces[1].creatorFullName,
                status: (OrganizationPlacesLotManagement.statuses as $TSFixMe).EXPIRED,
            },
        },
    ],
};

      // when
      const json = organizationPlaceLotManagementSerializer.serialize(organizationPlaces);

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });
});
