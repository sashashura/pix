// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationTag = require('../../../../lib/domain/models/OrganizationTag');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildOrganizationTag({ id = 123, organizationId = 456, tagId = 789 } = {}) {
  return new OrganizationTag({ id, organizationId, tagId });
};
