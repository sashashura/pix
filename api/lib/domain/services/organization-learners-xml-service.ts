// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SieclePars... Remove this comment to see the full error message
const SiecleParser = require('../../infrastructure/serializers/xml/siecle-parser');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractOrganizationLearnersInformationFromSIECLE,
};

async function extractOrganizationLearnersInformationFromSIECLE(path: $TSFixMe, organization: $TSFixMe) {
  const parser = new SiecleParser(organization, path);

  return parser.parse();
}
