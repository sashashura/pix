// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenterMembership = require('../../../../lib/domain/models/CertificationCenterMembership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCenter = require('./build-certification-center');

function _buildUser() {
  return new User({
    id: 456,
    firstName: 'Bertrand',
    lastName: 'Nolan',
    email: 'bertrand.nolan@example.net',
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCenterMembership({
  id = 1,
  certificationCenter = buildCertificationCenter(),
  user = _buildUser(),
  createdAt = new Date('2020-01-01'),
  disabledAt
}: $TSFixMe = {}) {
  return new CertificationCenterMembership({
    id,
    certificationCenter,
    user,
    createdAt,
    disabledAt,
  });
};
