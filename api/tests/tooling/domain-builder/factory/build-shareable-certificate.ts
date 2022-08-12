// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ShareableC... Remove this comment to see the full error message
const ShareableCertificate = require('../../../../lib/domain/models/ShareableCertificate');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCleaCertificationResult = require('./build-clea-certification-result');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildShareableCertificate({
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
  cleaCertificationResult = buildCleaCertificationResult.notTaken(),
  certifiedBadgeImages = [],
  resultCompetenceTree = null,
} = {}) {
  return new ShareableCertificate({
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
    resultCompetenceTree,
    cleaCertificationResult,
    certifiedBadgeImages,
  });
};
