// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationCreationValidator = require('../validators/organization-creation-validator');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createOrganization({
  createdBy,
  externalId,
  logoUrl,
  name,
  type,
  provinceCode,
  documentationUrl,
  organizationRepository
}: $TSFixMe) {
  organizationCreationValidator.validate({ name, type, documentationUrl });
  const organization = new Organization({ createdBy, name, type, logoUrl, externalId, provinceCode, documentationUrl });
  return organizationRepository.create(organization);
};
