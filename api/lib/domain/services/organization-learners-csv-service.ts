// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerParser = require('../../infrastructure/serializers/csv/organization-learner-parser');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractOrganizationLearnersInformation,
};

async function extractOrganizationLearnersInformation(path: $TSFixMe, organization: $TSFixMe, i18n: $TSFixMe) {
  const buffer = await fs.readFile(path);
  const parser = OrganizationLearnerParser.buildParser(buffer, organization.id, i18n);
  return parser.parse().learners;
}
