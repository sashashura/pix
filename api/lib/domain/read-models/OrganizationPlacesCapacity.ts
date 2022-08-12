// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sumBy = require('lodash/sumBy');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = require('../constants/organization-places-categories');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categoriesByCode = {
  [categories.T0]: categories.FREE_RATE,
  [categories.T1]: categories.PUBLIC_RATE,
  [categories.T2]: categories.REDUCE_RATE,
  [categories.T2bis]: categories.SPECIAL_REDUCE_RATE,
  [categories.T3]: categories.FULL_RATE,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationPlacesCapacity {
  categories: $TSFixMe;
  id: $TSFixMe;
  constructor({
    placesLots,
    organizationId
  }: $TSFixMe) {
    this.id = `${organizationId}_places_capacity`;
    this.categories = [categories.T0, categories.T1, categories.T2, categories.T2bis, categories.T3].map((category) =>
      this.getPlacesCapacityForCategory(placesLots, category)
    );
  }

  getPlacesCapacityForCategory(placesLots: $TSFixMe, category: $TSFixMe) {
    const organizationPlacesLotsForCategory = placesLots.filter(
      // @ts-expect-error TS(7031): Binding element 'lotCategory' implicitly has an 'a... Remove this comment to see the full error message
      ({ category: lotCategory }) => lotCategory === category
    );

    return {
      category: categoriesByCode[category],
      count: sumBy(organizationPlacesLotsForCategory, 'count'),
    };
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationPlacesCapacity;
