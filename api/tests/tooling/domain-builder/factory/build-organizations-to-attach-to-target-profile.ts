// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationsToAttachToTargetProfile = require('../../../../lib/domain/models/OrganizationsToAttachToTargetProfile');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildOrganizationsToAttachToTargetProfile({ id = 123 } = {}) {
  return new OrganizationsToAttachToTargetProfile({
    id,
  });
};
