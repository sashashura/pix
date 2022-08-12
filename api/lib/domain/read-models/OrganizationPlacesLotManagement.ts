// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = require('../constants/organization-places-categories');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categoriesByCode = {
  [categories.T0]: categories.FREE_RATE,
  [categories.T1]: categories.PUBLIC_RATE,
  [categories.T2]: categories.REDUCE_RATE,
  [categories.T2bis]: categories.SPECIAL_REDUCE_RATE,
  [categories.T3]: categories.FULL_RATE,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationPlacesLotManagement {
  static statuses = statuses;

  static categories = categoriesByCode;

  activationDate: $TSFixMe;
  category: $TSFixMe;
  count: $TSFixMe;
  creatorFullName: $TSFixMe;
  expirationDate: $TSFixMe;
  id: $TSFixMe;
  reference: $TSFixMe;
  status: $TSFixMe;

  constructor({
    id,
    count,
    activationDate,
    expirationDate,
    reference,
    category,
    creatorFirstName,
    creatorLastName
  }: $TSFixMe = {}) {
    this.id = id;
    this.count = count;
    this.activationDate = activationDate;
    this.expirationDate = expirationDate;
    this.reference = reference;
    this.category = categoriesByCode[category];
    this.creatorFullName = `${creatorFirstName} ${creatorLastName}`;
    this.status = _setStatus(activationDate, expirationDate);
  }
}

function _setStatus(activationDate: $TSFixMe, expirationDate: $TSFixMe) {
  const today = new Date();

  if (Boolean(expirationDate) && expirationDate < today) {
    return (statuses as $TSFixMe).EXPIRED;
  }

  if (activationDate < today) {
    return (statuses as $TSFixMe).ACTIVE;
  }

  return (statuses as $TSFixMe).PENDING;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationPlacesLotManagement;
