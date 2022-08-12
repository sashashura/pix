// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = require('../constants/organization-places-categories');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validate'.
const validate = require('../validators/organization-places-lot-validator');

const codeByCategories = {
  [categories.FREE_RATE]: categories.T0,
  [categories.PUBLIC_RATE]: categories.T1,
  [categories.REDUCE_RATE]: categories.T2,
  [categories.SPECIAL_REDUCE_RATE]: categories.T2bis,
  [categories.FULL_RATE]: categories.T3,
};
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationPlacesLot {
  static categories = categories;

  activationDate: $TSFixMe;
  category: $TSFixMe;
  count: $TSFixMe;
  createdBy: $TSFixMe;
  expirationDate: $TSFixMe;
  organizationId: $TSFixMe;
  reference: $TSFixMe;

  constructor({
    organizationId,
    count,
    activationDate,
    expirationDate,
    reference,
    category,
    createdBy
  }: $TSFixMe = {}) {
    this.organizationId = organizationId;
    this.count = count || null;
    this.activationDate = activationDate;
    this.expirationDate = expirationDate;
    this.reference = reference;
    this.category = codeByCategories[category];
    this.createdBy = createdBy;
    validate(this);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationPlacesLot;
