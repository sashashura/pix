// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AllowedCer... Remove this comment to see the full error message
const AllowedCertificationCenterAccess = require('../../../../lib/domain/read-models/AllowedCertificationCenterAccess');

function buildAllowedCertificationCenterAccess({
  id = 123,
  name = 'Sunnydale Center',
  externalId = 'BUFFY_SLAYER',
  type = 'PRO',
  isRelatedToManagingStudentsOrganization = false,
  relatedOrganizationTags = [],
  habilitations = [],
  isSupervisorAccessEnabled = false,
} = {}) {
  return new AllowedCertificationCenterAccess({
    id,
    name,
    externalId,
    type,
    isRelatedToManagingStudentsOrganization,
    relatedOrganizationTags,
    habilitations,
    isSupervisorAccessEnabled,
  });
}

// @ts-expect-error TS(2454): Variable 'buildAllowedCertificationCenterAccess' i... Remove this comment to see the full error message
buildAllowedCertificationCenterAccess.notSco = function ({
  type = 'NOT_SCO',
  isRelatedToManagingStudentsOrganization = true,
}) {
  return new AllowedCertificationCenterAccess({
    type,
    isRelatedToManagingStudentsOrganization,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildAllowedCertificationCenterAccess;
