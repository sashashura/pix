// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = require('../../../../../../lib/domain/constants/organization-places-categories');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../../lib/infrastructure/serializers/jsonapi/organization-places-capacity-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesCapacity = require('../../../../../../lib/domain/read-models/OrganizationPlacesCapacity');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | organization-places-capacity-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert an organization participant model object into JSON API data', function () {
      // given
      const organizationPlacesCapacity = new OrganizationPlacesCapacity({
        organizationId: 1,
        placesLots: [{ category: categories.T0, count: 10 }],
      });

      const expectedJSON = {
        data: {
          attributes: {
            categories: [
              { category: categories.FREE_RATE, count: 10 },
              { category: categories.PUBLIC_RATE, count: 0 },
              { category: categories.REDUCE_RATE, count: 0 },
              { category: categories.SPECIAL_REDUCE_RATE, count: 0 },
              { category: categories.FULL_RATE, count: 0 },
            ],
          },
          id: '1_places_capacity',
          type: 'organization-places-capacities',
        },
      };

      // when
      const json = serializer.serialize(organizationPlacesCapacity);

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });
});
