// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');

function _buildOrganizationLearner({
  id = 1,
  lastName = 'Bono',
  firstName = 'Jean',
  birthdate = '2001-01-01',
  organization = null,
} = {}) {
  return new OrganizationLearner({ id, lastName, firstName, birthdate, organization });
}

function buildOrganization({
  id = 123,
  name = 'Lycée Luke Skywalker',
  type = 'SCO',
  logoUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  externalId = 'OrganizationIdLinksToExternalSource',
  provinceCode = '2A',
  isManagingStudents = false,
  credit = 500,
  email = 'jesuistonpere@example.net',
  createdAt = new Date('2018-01-12T01:02:03Z'),
  targetProfileShares = [],
  tags = [],
  createdBy,
  documentationUrl = 'https://pix.fr',
  showNPS = false,
  formNPSUrl = 'https://pix.fr',
  showSkills = false,
  archivedAt = null,
  identityProviderForCampaigns = null
}: $TSFixMe = {}) {
  return new Organization({
    id,
    name,
    type,
    logoUrl,
    externalId,
    provinceCode,
    isManagingStudents,
    credit,
    email,
    createdAt,
    targetProfileShares,
    tags,
    createdBy,
    documentationUrl,
    showNPS,
    formNPSUrl,
    showSkills,
    archivedAt,
    identityProviderForCampaigns,
  });
}

buildOrganization.withOrganizationLearners = function ({
  id = 123,
  name = 'Lycée Luke Skywalker',
  type = 'SCO',
  logoUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  externalId = 'OrganizationIdLinksToExternalSource',
  provinceCode = '2A',
  isManagingStudents = true,
  credit = 500,
  createdAt = new Date('2018-01-12T01:02:03Z'),
  students = [],
  createdBy,
  documentationUrl
}: $TSFixMe = {}) {
  const organization = new Organization({
    id,
    name,
    type,
    logoUrl,
    externalId,
    provinceCode,
    isManagingStudents,
    credit,
    createdAt,
    students,
    createdBy,
    documentationUrl,
  });

  organization.students = [
    _buildOrganizationLearner({ id: 1, lastName: 'Doe', firstName: 'John', organization }),
    _buildOrganizationLearner({ id: 2, lastName: 'Smith', firstName: 'Jane', organization }),
  ];

  return organization;
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildOrganization;
