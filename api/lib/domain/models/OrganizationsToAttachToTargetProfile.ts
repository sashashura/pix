// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoOrganiza... Remove this comment to see the full error message
const { NoOrganizationToAttach } = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationsToAttachToTargetProfile {
  id: $TSFixMe;
  organizations: $TSFixMe;
  constructor({
    id
  }: $TSFixMe) {
    this.id = id;
  }

  attach(organizationIds: $TSFixMe) {
    if (_.isEmpty(organizationIds)) {
      throw new NoOrganizationToAttach(`Il n'y a aucune organisation à rattacher.`);
    }
    this.organizations = _.uniq(organizationIds);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationsToAttachToTargetProfile;
