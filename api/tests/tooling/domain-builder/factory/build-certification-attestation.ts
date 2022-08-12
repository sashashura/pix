// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAttestation = require('../../../../lib/domain/models/CertificationAttestation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationAttestation({
  id = 1,
  firstName = 'Jean',
  lastName = 'Bon',
  birthdate = '1992-06-12',
  birthplace = 'Paris',
  isPublished = true,
  userId = 1,
  certificationCenter = 'L’université du Pix',
  date = new Date('2018-12-01T01:02:03Z'),
  deliveredAt = new Date('2018-10-03T01:02:03Z'),
  pixScore = 123,
  maxReachableLevelOnCertificationDate = 5,
  verificationCode = 'P-SOMECODE',
  certifiedBadges = [],
  resultCompetenceTree = null,
} = {}) {
  return new CertificationAttestation({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    pixScore,
    maxReachableLevelOnCertificationDate,
    verificationCode,
    certifiedBadges,
    resultCompetenceTree,
  });
};
